import { defineConfig } from 'vite';

export default defineConfig({
    esbuild: {
        // Matches the library build: React 16.13 has no react/jsx-runtime.
        jsx: 'transform',
    },
    server: {
        port: 9001,
    },
});
