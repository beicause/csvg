import { seedRandom } from './utils'

export type Processor<T = ''> = T extends string
  ? { (params: string[]): string | null }
  : { (params: string[]): string | null, options: T }

const seed = { value: 0 }
const storage = [] as string[]
const indexMap = new Map<string, number>()
const randomOptions = {
  seed,
  fractionDigits: 6
}
const indexOptions = { id: '0', map: indexMap }
indexMap.set(indexOptions.id, -1)

const setOptions = { storage }
const getOptions = { storage }


export const processRandom: Processor<{
  seed: { value: number }
  fractionDigits: number
}> = params => {
  const _options = processRandom.options
  const p1 = params[0] || ''
  const p2 = params[1]

  let num1 = Number(p1)
  if (isNaN(num1))
    throw new Error(`Invalid number "${p1}" in #random. params: ${params}`)

  let num2: number
  if (p2) {
    num2 = Number(p2)
    if (isNaN(num1))
      throw new Error(`Invalid number "${p2}" in #random. params: ${params}`)
  } else {
    num2 = num1
    num1 = 0
  }
  return seedRandom(_options.seed, num1, num2).toFixed(_options.fractionDigits)
}
processRandom.options = randomOptions


export const processRepeat: Processor = params => {
  const p1 = params.slice(0, -1).join(',')
  let p2 = parseInt(params[params.length - 1])
  if (!p2 || p2 < 0) p2 = 0
  let repeatText = ''
  for (let i = 0; i < p2; i++) repeatText += p1
  return repeatText
}


export const processIndex: Processor<{ id: string; map: Map<string, number> }> = params => {
  const _options = processIndex.options

  const step = parseInt(params[0] || '1')
  const id = params[1] || '0'
  if (params[2]) _options.map.set(id, parseInt(params[2]))
  _options.map.set(id, (_options.map.get(id) ?? -1) + step)

  return '' + _options.map.get(id)
}
processIndex.options = indexOptions

export const processSet: Processor<{ storage: string[] }> = params => {
  const _options = processSet.options
  _options.storage.push(params.join(','))
  return params.join(',')
}
processSet.options = setOptions

export const processGet: Processor<{ storage: string[] }> = params => {
  const _options = processGet.options
  let index = parseInt(params[0] || '')
  if (isNaN(index)) index = -1
  if (index < 0) index += _options.storage.length
  return _options.storage[index]
}
processGet.options = getOptions


export const processCalc: Processor = params => {
  const expression = params[0]
  if (!/^[\d\s.+\-*/%<>=&|!?:^~()]*$/.test(expression))
    throw new Error('Invalid expression in calc')
  const calc = new Function(`return (${expression})`)
  const result = Number(calc())
  if (isNaN(result)) throw new Error('calc result is NaN')
  return '' + result
}

