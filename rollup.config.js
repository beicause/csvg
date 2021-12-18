import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodePolyfill from 'rollup-plugin-polyfill-node'
import csvgPkg from './packages/csvg/package.json'
import path from 'path'

const resolveCsvg = (..._path) => path.resolve('packages/csvg', ..._path)

/**
 * @type { import('rollup').RollupOptions }
 */
const baseOptions = {
  input: [resolveCsvg('src/index.ts')],
  plugins: [
    commonjs(),
    json(),
    typescript({ tsconfig: './tsconfig.json' }),
    nodeResolve({ preferBuiltins: true })
  ],
  treeshake: {
    moduleSideEffects: 'no-external',
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false
  }
}
/**
 * @type { import('rollup').RollupOptions }
 */
const nodeOptions = {
  ...baseOptions,
  output: [
    { format: 'cjs', file: resolveCsvg(csvgPkg.main) },
    { format: 'esm', file: resolveCsvg(csvgPkg.module) },
  ]
}

/**
 * @type { import('rollup').RollupOptions }
 */
const browserOptions = {
  ...baseOptions,
  output: [
    { format: 'cjs', file: resolveCsvg(csvgPkg.exports['./dist/browser'].require) },
    { format: 'esm', file: resolveCsvg(csvgPkg.exports['./dist/browser'].import) },
  ]
}
browserOptions.plugins.splice(3, 0, nodePolyfill())

export default [nodeOptions, browserOptions]