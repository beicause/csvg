import { processCalc, processGet, processIndex, Processor, processRandom, processRepeat, processSet } from "./processor"
import { FunctionExpression, parse } from "./parser"

export class Compiler {
    private _input = ''
    private _output = ''
    private _parsed = [] as FunctionExpression[]
    get input() {
        return this._input
    }
    get output() {
        return this._output
    }
    get parsed() {
        return this._parsed
    }
    prefix = '@'
    important = '!'
    processors = new Map<string, { processor: Processor, prefix: string }>()

    constructor() {
        this.use('repeat', processRepeat)
        this.use('re', processRepeat)
        this.use('random', processRandom)
        this.use('ra', processRandom)
        this.use('index', processIndex)
        this.use('i', processIndex)
        this.use('set', processSet)
        this.use('get', processGet)
        this.use('calc', processCalc)
    }

    use(name: string, processor: Processor) {
        this.processors.set(name, { prefix: this.prefix, processor })
        return this
    }

    remove(name: string) {
        this.processors.delete(name)
        return this
    }
    parse(input: string) {
        this._input = input
        this._parsed = parse(this.input, this.prefix)
        return this.parsed
    }
    compile() {
        return this.output
    }
}
