import {
  processCalc,
  processGet,
  processIndex,
  Processor,
  processRandom,
  processRepeat,
  processSet
} from './process'
import { FunctionExpression, parse } from './parse'
import MagicString from 'magic-string'
import { optimize, loadConfig, OptimizeOptions } from 'svgo'

export class Compiler {
  prefix = '@'
  postfix = '!'
  processors = new Map<string, Processor>()

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
    this.processors.set(this.prefix + name, processor)
    this.processors.set(this.prefix + name + this.postfix, processor)
    return this
  }

  remove(name: string) {
    this.processors.delete(name)
    return this
  }
  compile(input: string) {
    let s = new MagicString(input)
    const important = parse(s.toString(), this.prefix, this.postfix)
    important.forEach(fun => {
      const res = executeFunctionWithPostfix(fun, this.postfix, this.processors)
      res && s.overwrite(fun.range[0], fun.range[1], res)
    })

    s = new MagicString(s.toString())
    const others = parse(s.toString(), this.prefix, '')
    others.forEach(fun => {
      const res = executeFunction(fun, this.processors)
      s.overwrite(fun.range[0], fun.range[1], res)
    })
    return s.toString()
  }

  static async optimize(input: string, config?: OptimizeOptions) {
    const _config = { ...(await loadConfig()), ...config }
    const res = optimize(input, _config)
    return res
  }
}

export function executeFunction(
  fun: FunctionExpression,
  processors: Map<string, Processor>
): string {
  const s = [] as string[]
  s[fun.range[0]] = fun.content
  const content = new MagicString(s.join(' '))
  fun.params.functions?.forEach(childFun => {
    const res = executeFunction(childFun, processors)
    content.overwrite(childFun.range[0], childFun.range[1], res)
  })
  const process = processors.get(fun.name)
  const params = content.slice(
    fun.name.length + fun.range[0] + 1,
    fun.range[1] - 1
  )
  if (process) return process(params)
  return content.slice(fun.range[0], content.length())
}

export function executeFunctionWithPostfix(
  fun: FunctionExpression,
  postfix: string,
  processors: Map<string, Processor>
): string | null {
  if (!fun.name.endsWith(postfix)) return null
  const s = [] as string[]
  s[fun.range[0]] = fun.content
  const content = new MagicString(s.join(' '))
  fun.params.functions?.forEach(childFun => {
    const res = executeFunctionWithPostfix(childFun, postfix, processors)
    res && content.overwrite(childFun.range[0], childFun.range[1], res)
  })
  const process = processors.get(fun.name)
  const params = content.slice(
    fun.name.length + fun.range[0] + 1,
    fun.range[1] - 1
  )
  if (process) return process(params)
  return null
}
