import { defineConfig } from 'vite';
import cssInjectedByJs from 'vite-plugin-css-injected-by-js';

export default defineConfig({
    // Styles are injected at runtime instead of being emitted as a separate
    // stylesheet, so importing the component is enough to get its CSS.
    plugins: [cssInjectedByJs()],
    oxc: {
        jsx: {
            runtime: 'automatic',
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['src/setupTests.js'],
        css: {
            modules: {
                // Keep class names unhashed so tests can assert on them directly.
                classNameStrategy: 'non-scoped',
            },
        },
    },
    build: {
        lib: {
            entry: 'src/index.js',
            formats: ['es', 'cjs'],
            fileName: (format) => (format === 'cjs' ? 'main.cjs' : 'main.mjs'),
        },
        rollupOptions: {
            external: (id) => /^(react|react-dom|prop-types)(\/|$)/.test(id),
        },
    },
});
