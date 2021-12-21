import typescript from 'rollup-plugin-typescript2'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodePolyfill from 'rollup-plugin-polyfill-node'
import csvgPkg from './packages/csvg/package.json'
import path from 'path'

const resolveCsvg = (..._path) => path.resolve('packages/csvg', ..._path)

const generateDts = () => {
  /**
   * @type { import('rollup').Plugin }
   */
  const plugin = {
    name: 'dts',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'index.d.ts',
        source: `export * from '../../types'`
      })
    }
  }
  return plugin
}

const baseOptions = () => {
  /**
   * @type { import('rollup').RollupOptions }
   */
  const options = {
    input: [resolveCsvg('src/index.ts')],
    plugins: [
      commonjs(),
      json(),
      typescript(),
      nodeResolve({ preferBuiltins: true }),
      generateDts()
    ],
    treeshake: {
      moduleSideEffects: 'no-external',
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false
    }
  }
  return options
}
/**
 * @type { import('rollup').RollupOptions }
 */
const nodeOptions = {
  ...baseOptions(),
  output: [
    { format: 'cjs', file: resolveCsvg(csvgPkg.main) },
    { format: 'esm', file: resolveCsvg(csvgPkg.module) }
  ]
}

/**
 * @type { import('rollup').RollupOptions }
 */
const browserOptions = {
  ...baseOptions(),
  output: [
    {
      format: 'cjs',
      file: resolveCsvg(csvgPkg.exports['./dist/browser'].require)
    },
    {
      format: 'esm',
      file: resolveCsvg(csvgPkg.exports['./dist/browser'].import)
    }
  ]
}
browserOptions.plugins.splice(3, 0, nodePolyfill())

export default [nodeOptions, browserOptions]
