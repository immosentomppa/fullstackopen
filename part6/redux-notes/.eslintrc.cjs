const js = require('@eslint/js')
const globals = require('globals')
const reactHooks = require('eslint-plugin-react-hooks')
const reactRefresh = require('eslint-plugin-react-refresh')

module.exports = {
  ignorePatterns: ['dist'],
  overrides: [
    {
      files: ['**/*.{js,jsx}'],
      extends: [
        ...js.configs.recommended,
        ...reactHooks.configs['recommended-latest'],
        ...reactRefresh.configs.vite,
      ],
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
      env: {
        browser: true,
        es2020: true,
        "jest/globals": true
      },
      globals: globals.browser,
      rules: {
        'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      },
    },
  ],
}