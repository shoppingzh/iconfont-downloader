/* eslint-disable @typescript-eslint/no-var-requires */
const javascript = require('@shoppingzh/eslint-config/javascript')
const stylistic = require('@shoppingzh/eslint-config/stylistic')
const typescript = require('@shoppingzh/eslint-config/typescript')
const globals = require('globals')

module.exports = [
  {
    ignores: ['dist']
  },
  ...javascript({
    globals: {
      ...globals.jest,
    },
  }),
  ...stylistic(),
  ...typescript(),
]
