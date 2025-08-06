import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // Ignore dist folder from linting
    ignores: ['dist'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    // Extend recommended configs for JS and TypeScript
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      // Optional: for stricter rules
      // ...tseslint.configs.strict,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Enforce React Hooks rules
      ...reactHooks.configs.recommended.rules,
      // Warn if components are not exported correctly (for HMR)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);
