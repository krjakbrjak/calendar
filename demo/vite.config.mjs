import { defineConfig } from 'vite';

export default defineConfig({
    oxc: {
        jsx: {
            runtime: 'automatic',
        },
    },
    server: {
        port: 9001,
    },
});
