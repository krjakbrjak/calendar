import { defineConfig } from 'vite';
import cssInjectedByJs from 'vite-plugin-css-injected-by-js';

export default defineConfig({
    // Styles are injected at runtime instead of being emitted as a separate
    // stylesheet, so importing the component is enough to get its CSS.
    plugins: [cssInjectedByJs()],
    oxc: {
        jsx: {
            // React 16.13 predates react/jsx-runtime, so the classic
            // React.createElement transform is required.
            runtime: 'classic',
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
            name: 'Calendar',
            formats: ['umd', 'es'],
            fileName: (format) => (format === 'umd' ? 'main.js' : 'main.mjs'),
        },
        rollupOptions: {
            // Supplied by the consumer, same as the previous webpack build.
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
});
