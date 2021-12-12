export * from './compiler'
export * from './utils'
import {
  Middleware,
  getRandomCompiler,
  getIndexCompiler,
  getRepeatCompiler,
  getGetCompiler,
  getSetCompiler,
  getCalcCompiler
} from './compiler'

export class Compiler {
  private _input = ''
  private _output = ''
  get input() {
    return this._input
  }
  get output() {
    return this._output
  }
  middleware = new Map<string, Middleware>()

  constructor() {
    this.use('repeat', getRepeatCompiler())
    this.use('re', getRepeatCompiler({ name: 're' }))
    this.use('random', getRandomCompiler())
    this.use('ra', getRandomCompiler({ name: 'ra' }))
    this.use('index', getIndexCompiler())
    this.use('i', getIndexCompiler({ name: 'i' }))
    this.use('set', getSetCompiler())
    this.use('get', getGetCompiler())
    this.use('calc', getCalcCompiler())
  }

  use(name: string, compiler: Middleware) {
    this.middleware.set(name, compiler)
  }

  remove(name: string) {
    this.middleware.delete(name)
  }
  compile(input: string) {
    this._input = input
    this._output = input
    this.middleware.forEach(m => {
      this._output = m(this._output)
    })
    return this.output
  }
}
