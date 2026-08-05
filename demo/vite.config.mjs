import { defineConfig } from 'vite';

export default defineConfig({
    oxc: {
        jsx: {
            // Matches the library build: React 16.13 has no react/jsx-runtime.
            runtime: 'classic',
        },
    },
    server: {
        port: 9001,
    },
});
