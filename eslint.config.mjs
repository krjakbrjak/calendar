import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importX from 'eslint-plugin-import-x';
import stylistic from '@stylistic/eslint-plugin';

export default [
    {
        ignores: ['dist/', 'docs/', 'demo/dist/', '.yarn/'],
    },
    js.configs.recommended,
    react.configs.flat.recommended,
    react.configs.flat['jsx-runtime'],
    reactHooks.configs.flat.recommended,
    jsxA11y.flatConfigs.recommended,
    importX.flatConfigs.recommended,
    importX.flatConfigs.react,
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.browser,
        },
        settings: {
            react: {
                version: '19.2',
            },
            'import-x/resolver': {
                node: {
                    extensions: ['.js', '.jsx', '.mjs'],
                },
            },
        },
        plugins: {
            '@stylistic': stylistic,
        },
        rules: {
            '@stylistic/indent': ['error', 4],
            '@stylistic/jsx-indent-props': ['error', 4],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/comma-dangle': ['error', 'always-multiline'],
            'react/require-default-props': ['error', { functions: 'defaultArguments' }],
            'import-x/no-extraneous-dependencies': ['error', {
                devDependencies: false,
                peerDependencies: true,
            }],
        },
    },
    {
        files: ['src/**/__tests__/**/*.{js,jsx}', 'src/setupTests.js'],
        languageOptions: {
            globals: globals.vitest,
        },
        rules: {
            'import-x/no-extraneous-dependencies': ['error', { devDependencies: true }],
        },
    },
];
