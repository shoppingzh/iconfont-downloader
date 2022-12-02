import path from 'path'
import { defineConfig } from 'rollup'
import alias from '@rollup/plugin-alias'
import ts from '@rollup/plugin-typescript'
import clear from 'rollup-plugin-clear'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'umd',
    name: 'MyLib'
  },
  plugins: [
    alias({
      entries: [{
        find: '@',
        replacement: 'src'
      }]
    }),
    clear({
      targets: ['dist']
    }),
    ts({
      tsconfig: path.resolve(__dirname, './tsconfig.build.json'),
    })
  ]
})
