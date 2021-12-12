import { seedRandom } from './utils'

export type Params = {
  content: string
  open: number
  close: number
  params: string[]
}
export interface Options {
  sign?: string
  name?: string
}
export interface RandomOptions extends Options {
  seed?: { value: number }
  fractionDigits?: number
}
export type Middleware<T extends Options = Options> = {
  (input: string): string
  options: Required<T>
}

const baseOptions = {
  sign: '@'
}
const seed = { value: 0 }
const storage = [] as string[]
const indexMap = new Map<string, number>()
const randomOptions = {
  ...baseOptions,
  name: 'random',
  seed,
  fractionDigits: 6
}
const repeatOptions = { ...baseOptions, name: 'repeat' }
const indexOptions = { ...baseOptions, name: 'index', id: '0', map: indexMap }
indexMap.set(indexOptions.id, -1)

const setOptions = { ...baseOptions, name: 'set', storage }
const getOptions = { ...baseOptions, name: 'get', storage }
const calcOptions = { ...baseOptions, name: 'calc' }

export function replaceMacro(
  input: string,
  replace: string,
  params: Params,
  name: string
): string {
  return (
    input.substring(0, params.open - name.length - 1) +
    replace +
    input.substring(params.close + 1)
  )
}
export function resolveParams(
  input: string,
  options: Required<Options>
): Params | undefined {
  const _name = options.sign + options.name
  const open = input.indexOf(_name) + _name.length
  if (open === _name.length - 1) return
  const commas = [] as number[]
  // find closing parenthesis
  let close = -1
  let count = 1
  for (let i = open + 1; i < input.length; i++) {
    const char = input[i]
    if (char === ',' && count === 1) commas.push(i)
    if (char === '(') count++
    if (char === ')') {
      count--
      if (count === 0) {
        close = i
        break
      }
    }
  }
  if (close === -1) throw new Error(`miss close parenthesis: ${input}`)
  const params = [] as string[]
  if (open + 1 !== close)
    params.push(input.substring(open + 1, commas[0] ?? close))
  for (let i = 0; i < commas.length; i++) {
    params.push(input.substring(commas[i] + 1, commas[i + 1] ?? close))
  }
  const content = input.substring(open + 1, close)
  return { content, open, close, params }
}

export function getRandomCompiler(
  options?: RandomOptions
): Middleware<RandomOptions> {
  const compileRandom: Middleware<RandomOptions> = input => {
    const _options = compileRandom.options
    const params = resolveParams(input, _options)
    if (!params) return input
    const p1 = params.params[0] || ''
    const p2 = params.params[1]

    let num1 = Number(compileRandom(p1))
    if (isNaN(num1))
      throw new Error(`Invalid number "${p1}" in #random. input: ${input}`)

    let num2: number
    if (p2) {
      num2 = Number(compileRandom(p2))
      if (isNaN(num1))
        throw new Error(`Invalid number "${p2}" in #random. input: ${input}`)
    } else {
      num2 = num1
      num1 = 0
    }
    const res = replaceMacro(
      input,
      seedRandom(_options.seed, num1, num2).toFixed(_options.fractionDigits),
      params,
      _options.name
    )
    return compileRandom(res)
  }
  compileRandom.options = { ...randomOptions, ...options }
  return compileRandom
}

export function getRepeatCompiler(options?: Options) {
  const compileRepeat: Middleware = input => {
    const _options = compileRepeat.options
    const name = _options.name
    const params = resolveParams(input, _options)

    if (!params) return input
    const p1 = params.params.slice(0, -1).join(',')
    let p2 = parseInt(params.params[params.params.length - 1])
    if (!p2 || p2 < 0) p2 = 0
    let repeatText = ''
    for (let i = 0; i < p2; i++) repeatText += p1
    const res = replaceMacro(input, repeatText, params, name)
    return compileRepeat(res)
  }
  compileRepeat.options = { ...repeatOptions, ...options }
  return compileRepeat
}

export function getIndexCompiler(
  options?: Options & { id?: string; map?: Map<string, number> }
) {
  const compileIndex: Middleware<NonNullable<typeof options>> = input => {
    const _options = compileIndex.options
    const name = _options.name
    const params = resolveParams(input, _options)
    if (!params) return input
    const step = parseInt(params.params[0] || '1')
    const id = params.params[1] || '0'
    if (params.params[2]) _options.map.set(id, parseInt(params.params[2]))
    _options.map.set(id, (_options.map.get(id) ?? -1) + step)
    const res = replaceMacro(input, '' + _options.map.get(id), params, name)
    return compileIndex(res)
  }
  compileIndex.options = { ...indexOptions, ...options }
  return compileIndex
}

export function getSetCompiler(options?: Options & { storage?: string[] }) {
  const compileSet: Middleware<NonNullable<typeof options>> = input => {
    const _options = compileSet.options
    const params = resolveParams(input, _options)
    if (!params) return input
    _options.storage.push(params.content)
    const res = replaceMacro(input, params.content, params, _options.name)
    return compileSet(res)
  }
  compileSet.options = { ...setOptions, ...options }
  return compileSet
}

export function getGetCompiler(options?: Options & { storage?: string[] }) {
  const compileGet: Middleware<NonNullable<typeof options>> = input => {
    const _options = compileGet.options
    const params = resolveParams(input, _options)
    if (!params) return input
    let index = parseInt(compileGet(params.params[0] || ''))
    if (isNaN(index)) index = -1
    if (index < 0) index += _options.storage.length
    const res = replaceMacro(
      input,
      _options.storage[index],
      params,
      _options.name
    )
    return compileGet(res)
  }
  compileGet.options = { ...getOptions, ...options }
  return compileGet
}

export function getCalcCompiler(options?: Options) {
  const compileCalc: Middleware = input => {
    const _options = compileCalc.options
    const params = resolveParams(input, _options)
    if (!params) return input
    const expression = params.params[0]
    if (!/^[\d\s.+\-*/%<>=&|!?:^~()]*$/.test(expression))
      throw new Error('Invalid expression in calc')
    const calc = new Function(`return (${expression})`)
    const result = Number(calc())
    if (isNaN(result)) throw new Error('calc result is NaN')
    const res = replaceMacro(input, '' + result, params, _options.name)
    return compileCalc(res)
  }
  compileCalc.options = { ...calcOptions, ...options }
  return compileCalc
}
