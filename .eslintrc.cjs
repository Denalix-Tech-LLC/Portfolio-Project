/* Linting focused on React correctness + accessibility (jsx-a11y).
   Run with: npm run lint */
module.exports = {
  root: true,
  ignorePatterns: ['dist', 'node_modules'],
  env: { browser: true, es2021: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  settings: { react: { version: 'detect' } },
  overrides: [
    // Vercel serverless functions run in Node, not the browser.
    { files: ['api/**/*.js'], env: { node: true, browser: false } },
  ],
  rules: {
    'react/prop-types': 'off',
    // role="list" is intentional: Tailwind Preflight strips list-style, which
    // makes Safari/VoiceOver drop list semantics without an explicit role.
    'jsx-a11y/no-redundant-roles': ['error', { ul: ['list'], ol: ['list'] }],
  },
}
