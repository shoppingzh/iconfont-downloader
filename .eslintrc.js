/** @type {import('@types/eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    '@shoppingzh/eslint-config',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    'array-bracket-newline': [0]
  },
}
