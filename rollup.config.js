import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import { defineConfig } from 'rollup'
import csvgPkg from './packages/csvg/package.json'
import path from 'path'

const resolveCsvg = _path => path.resolve('packages/csvg', _path)

export default defineConfig({
  input: [resolveCsvg('src/index.ts')],
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
    nodeResolve({ preferBuiltins: true })
  ],
  treeshake: {
    moduleSideEffects: 'no-external',
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false
  },
  output: [
    { format: 'cjs', file: resolveCsvg(csvgPkg.main) },
    { format: 'esm', file: resolveCsvg(csvgPkg.module) }
  ]
})