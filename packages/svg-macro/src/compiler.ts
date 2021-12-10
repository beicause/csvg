import { seedRandom } from './utils'


export type Params = {
    content: string, open: number, close: number, params: string[]
}
export interface Options {
    sign?: string, name?: string
}
export interface RandomOptions extends Options {
    seed?: number, fractionDigits?: number
}
export type CompileWare<T extends Options = Options> = (options?: T) => Middleware
export type Middleware = (input: string) => string

const baseOptions = {
    sign: '#'
}
const randomOptions = { ...baseOptions, name: 'random', seed: 0, fractionDigits: 6 }
const repeatOptions = { ...baseOptions, name: 'repeat' }

export function resolveParams(input: string, options: Required<Options>): Params | undefined {
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
    if (open + 1 !== close) params.push(input.substring(open + 1, commas[0] ?? close))
    for (let i = 0; i < commas.length; i++) {
        params.push(input.substring(commas[i] + 1, commas[i + 1] ?? close))
    }
    const content = input.substring(open + 1, close)
    return { content, open, close, params }
}

export const compileRandom: CompileWare<RandomOptions> = options => input => {
    const _options = { ...randomOptions, ...options } as Required<RandomOptions>
    const params = resolveParams(input, _options)
    if (!params) return input
    const p1 = params.params[0] || ''
    const p2 = params.params[1]

    let num1 = Number(compileRandom(_options)(p1))
    if (isNaN(num1)) throw new Error(`Invalid number "${p1}" in #random. input: ${input}`)

    let num2: number
    if (p2) {
        num2 = Number(compileRandom(_options)(p2))
        if (isNaN(num1)) throw new Error(`Invalid number "${p2}" in #random. input: ${input}`)
    }
    else {
        num2 = num1
        num1 = 0
    }
    const res = input.substring(0, params.open - _options.name.length - 1) + seedRandom(_options, num1, num2).toFixed(_options.fractionDigits) + input.substring(params.close + 1)
    return compileRandom(_options)(res)
}

export const compileRepeat: CompileWare = options => input => {
    const _options = { ...repeatOptions, ...options } as Required<Options>
    const name = _options.name
    const params = resolveParams(input, _options)

    if (!params) return input
    const p1 = params.params[0] || ''
    let p2 = parseInt(params.params[params.params.length - 1])
    if (!p2 || p2 < 1) p2 = 1
    let repeatText = ''
    for (let i = 0; i < p2; i++) repeatText += p1
    const res = input.substring(0, params.open - name.length - 1) + repeatText + input.substring(params.close + 1)
    return compileRepeat(_options)(res)
}