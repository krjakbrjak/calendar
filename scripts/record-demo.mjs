import { mkdir, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright-core';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
    .scriptName('record-demo')
    .usage(
        '$0 --frames <dir> --url <url> --chrome <path>\n\n' +
            'Drives a headless Chrome with Playwright and writes one PNG per\n' +
            'animation step into --frames, numbered for ffmpeg. The clock is\n' +
            'pinned so the recording is reproducible.\n\n' +
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
const NOW = new Date(Date.UTC(2026, 5, 15, 12, 0, 0));

const drawCursor = () => {
    const cursor = document.createElement('div');
    cursor.style.cssText = [
        'position:fixed',
        'z-index:9999',
        'width:18px',
        'height:18px',
        'margin:-9px 0 0 -9px',
        'border-radius:50%',
        'background:rgba(28,35,49,.28)',
        'border:2px solid rgba(28,35,49,.65)',
        'pointer-events:none',
    ].join(';');

    const attach = () => {
        document.body.appendChild(cursor);
        globalThis.__cursor = (x, y) => {
            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;
        };
        globalThis.__press = (down) => {
            cursor.style.transform = down ? 'scale(.75)' : 'scale(1)';
        };
    };

    if (document.body) {
        attach();
    } else {
        document.addEventListener('DOMContentLoaded', attach);
    }
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

    const browser = await chromium.launch({ executablePath: CHROME });
    let frame = 0;

    try {
        const page = await browser.newPage({
            viewport: { width: WIDTH, height: HEIGHT },
            deviceScaleFactor: SCALE,
        });

        await page.clock.setFixedTime(NOW);
        await page.addInitScript(drawCursor);
        await page.goto(DEMO_URL);
        await page.waitForTimeout(600);

        const capture = async (count = 1) => {
            for (let i = 0; i < count; i += 1) {
                const name = String(frame).padStart(4, '0');
                frame += 1;
                await page.screenshot({ path: join(FRAMES, `${name}.png`) });
            }
        };

        const centre = async (locator) => {
            const box = await locator.boundingBox();
            return { x: Math.round(box.x + box.width / 2), y: Math.round(box.y + box.height / 2) };
        };

        const days = page.locator('.nav__calendar button');
        const next = page.locator('.nav__button').nth(1);

        const moveTo = async (x, y) => {
            await page.mouse.move(x, y);
            await page.evaluate(([px, py]) => globalThis.__cursor(px, py), [x, y]);
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
            await page.mouse.down();
            await page.evaluate(() => globalThis.__press(true));
            await capture(2);
            await page.mouse.up();
            await page.evaluate(() => globalThis.__press(false));
            await capture(2);
        };

        const first = await centre(days.nth(8));
        const last = await centre(days.nth(19));
        const nextCentre = await centre(next);
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

        await glide(last, nextCentre, 14);
        await click(nextCentre);
        await capture(16);

        process.stdout.write(`${frame} frames -> ${FRAMES}\n`);
    } finally {
        await browser.close();
    }
};

await run();
