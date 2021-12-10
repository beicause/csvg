export * from './compiler'
export * from './utils'
import { Middleware } from '.'


export class Compiler {
    private _input = ''
    private _output = ''
    middleware = [] as ((input: string) => string)[]
    get input() { return this._input }
    get output() { return this._output }

    use(...middleware: Middleware[]) {
        this.middleware = [...this.middleware, ...middleware]
        return this
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