import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import pkg from './package.json'

export default defineConfig({
  input: 'src/index.ts',
  plugins: [typescript({
    tsconfig:'./tsconfig.json'
  })],
  treeshake: {
    moduleSideEffects: 'no-external',
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false
  },
  output: [
    { format: 'cjs', file: pkg.main },
    { format: 'esm', file: pkg.module }
  ]
})