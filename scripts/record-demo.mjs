import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
    .scriptName('record-demo')
    .usage(
        '$0 --frames <dir> --url <url> --chrome <path>\n\n' +
            'Drives a headless Chrome over the DevTools Protocol and writes one\n' +
            'PNG per animation step into --frames, numbered for ffmpeg. The clock\n' +
            'is pinned so the recording is reproducible.\n\n' +
            'The app must already be served at --url. Encode the frames with e.g.\n' +
            '  ffmpeg -framerate 15 -i <dir>/%04d.png -plays 0 -f apng out.png',
    )
    .option('frames', {
        type: 'string',
        demandOption: true,
        describe: 'Directory to write numbered PNG frames into',
    })
    .option('url', {
        type: 'string',
        demandOption: true,
        describe: 'URL of the running app',
    })
    .option('chrome', {
        type: 'string',
        demandOption: true,
        default: process.env.CHROME,
        defaultDescription: '$CHROME',
        describe: 'Chrome or Chromium binary',
    })
    .check(({ chrome }) => {
        if (!existsSync(resolve(process.cwd(), chrome))) {
            throw new Error(`browser not found: ${chrome}`);
        }
        return true;
    })
    .strict()
    .help()
    .parseSync();

const FRAMES = resolve(process.cwd(), argv.frames);
const DEMO_URL = argv.url;
const CHROME = resolve(process.cwd(), argv.chrome);

const WIDTH = 620;
const HEIGHT = 600;
const SCALE = 2;

// Pinned so the recording always shows the same month.
const NOW = Date.UTC(2026, 5, 15, 12, 0, 0);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let browser = null;

process.on('SIGINT', () => {
    browser?.kill();
    process.exit(130);
});
process.on('SIGTERM', () => {
    browser?.kill();
    process.exit(143);
});

const waitFor = async (check, { timeout = 30000, every = 200 } = {}) => {
    const deadline = Date.now() + timeout;
    for (;;) {
        const value = await check();
        if (value) {
            return value;
        }
        if (Date.now() > deadline) {
            throw new Error('timed out waiting for condition');
        }
        await sleep(every);
    }
};

const startChrome = async () => {
    const userDataDir = await mkdtemp(join(tmpdir(), 'calendar-record-'));
    browser = spawn(CHROME, [
        '--headless=new',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--hide-scrollbars',
        '--remote-debugging-port=0',
        `--user-data-dir=${userDataDir}`,
        'about:blank',
    ]);

    const portFile = join(userDataDir, 'DevToolsActivePort');
    const port = await waitFor(async () => {
        try {
            const [line] = (await readFile(portFile, 'utf8')).split('\n');
            return line || null;
        } catch {
            return null;
        }
    });

    const target = await waitFor(async () => {
        const res = await fetch(`http://127.0.0.1:${port}/json/list`);
        const targets = await res.json();
        return targets.find((t) => t.type === 'page') ?? null;
    });

    return { userDataDir, wsUrl: target.webSocketDebuggerUrl };
};

const connect = async (wsUrl) => {
    const socket = new WebSocket(wsUrl);
    await new Promise((resolve, reject) => {
        socket.addEventListener('open', resolve, { once: true });
        socket.addEventListener('error', reject, { once: true });
    });

    let nextId = 0;
    const pending = new Map();
    const listeners = [];

    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        if (message.id !== undefined) {
            const entry = pending.get(message.id);
            pending.delete(message.id);
            if (message.error) {
                entry.reject(new Error(message.error.message));
            } else {
                entry.resolve(message.result);
            }
            return;
        }
        listeners.forEach((fn) => fn(message));
    });

    const send = (method, params = {}) =>
        new Promise((resolve, reject) => {
            const id = (nextId += 1);
            pending.set(id, { resolve, reject });
            socket.send(JSON.stringify({ id, method, params }));
        });

    const once = (method) =>
        new Promise((resolve) => {
            const fn = (message) => {
                if (message.method === method) {
                    listeners.splice(listeners.indexOf(fn), 1);
                    resolve(message.params);
                }
            };
            listeners.push(fn);
        });

    return { send, once, close: () => socket.close() };
};

const run = async () => {
    try {
        await fetch(DEMO_URL);
    } catch {
        throw new Error(`nothing answering at ${DEMO_URL}, start the app first`);
    }

    await mkdir(FRAMES, { recursive: true });
    for (const name of await readdir(FRAMES)) {
        if (/^\d{4}\.png$/.test(name)) {
            await rm(join(FRAMES, name));
        }
    }

    const chrome = await startChrome();
    let cdp;
    let frame = 0;

    try {
        cdp = await connect(chrome.wsUrl);
        await cdp.send('Page.enable');
        await cdp.send('Runtime.enable');
        await cdp.send('Emulation.setDeviceMetricsOverride', {
            width: WIDTH,
            height: HEIGHT,
            deviceScaleFactor: SCALE,
            mobile: false,
        });

        const loaded = cdp.once('Page.loadEventFired');
        await cdp.send('Page.navigate', { url: DEMO_URL });
        await loaded;
        await sleep(600);

        const evaluate = async (expression) => {
            const { result, exceptionDetails } = await cdp.send('Runtime.evaluate', {
                expression,
                returnByValue: true,
            });
            if (exceptionDetails) {
                throw new Error(`${exceptionDetails.text}: ${expression.trim().slice(0, 60)}`);
            }
            return result.value;
        };

        const capture = async (count = 1) => {
            for (let i = 0; i < count; i += 1) {
                const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
                const name = String(frame).padStart(4, '0');
                frame += 1;
                await writeFile(join(FRAMES, `${name}.png`), Buffer.from(data, 'base64'));
            }
        };

        const centres = await evaluate(`
            (() => {
                const box = (el) => {
                    const r = el.getBoundingClientRect();
                    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
                };
                return {
                    days: [...document.querySelectorAll('.nav__calendar button')].map(box),
                    next: box(document.querySelectorAll('.nav__button')[1]),
                };
            })()
        `);

        const moveTo = async (x, y) => {
            await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
        };

        const glide = async (from, to, steps) => {
            for (let i = 1; i <= steps; i += 1) {
                const t = i / steps;
                await moveTo(
                    Math.round(from.x + (to.x - from.x) * t),
                    Math.round(from.y + (to.y - from.y) * t),
                );
                await capture();
            }
        };

        const click = async ({ x, y }) => {
            const button = { button: 'left', clickCount: 1, x, y };
            await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...button });
            await capture(2);
            await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...button });
            await capture(2);
        };

        // 8 June and 19 June 1970-style offsets: indices into the rendered grid
        const first = centres.days[8];
        const last = centres.days[19];
        const start = { x: first.x - 140, y: first.y + 90 };

        await moveTo(start.x, start.y);
        await capture(6);

        await glide(start, first, 12);
        await capture(3);
        await click(first);

        await glide(first, last, 20);
        await capture(4);
        await click(last);
        await capture(16);

        await glide(last, centres.next, 14);
        await click(centres.next);
        await capture(16);

        process.stdout.write(`${frame} frames -> ${FRAMES}\n`);
    } finally {
        cdp?.close();
        browser.kill();
        if (browser.exitCode === null) {
            await new Promise((resolve) => browser.once('exit', resolve));
        }
        const cleanup = { recursive: true, force: true, maxRetries: 10, retryDelay: 200 };
        await rm(chrome.userDataDir, cleanup);
    }
};

await run();
