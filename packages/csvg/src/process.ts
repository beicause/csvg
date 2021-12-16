import { seedRandom } from './utils'

export interface Processor<T = any> {
  (params: string): string
  options?: T
}

export const processRandom: Processor<{
  seed: { value: number }
  fractionDigits: number
}> = _params => {
  processRandom.options ||= {
    seed: { value: 0 },
    fractionDigits: 6
  }
  const params = _params.split(',')
  const _options = processRandom.options
  const p1 = params[0] || ''
  const p2 = params[1]

  let num1 = Number(p1)
  if (isNaN(num1))
    throw new Error(`Invalid number "${p1}" in random. params: ${_params}`)

  let num2: number
  if (p2) {
    num2 = Number(p2)
    if (isNaN(num1))
      throw new Error(`Invalid number "${p2}" in random. params: ${_params}`)
  } else {
    num2 = num1
    num1 = 0
  }
  return seedRandom(_options.seed, num1, num2).toFixed(_options.fractionDigits)
}

export const processRepeat: Processor = _params => {
  const params = _params.split(',')
  const p1 = params.slice(0, -1).join(',')
  let p2 = parseInt(params[params.length - 1])
  if (!p2 || p2 < 0) p2 = 0
  let repeatText = ''
  for (let i = 0; i < p2; i++) repeatText += p1
  return repeatText
}

export const processIndex: Processor<{
  map: Map<string, number>
}> = _params => {
  if (!processIndex.options) {
    processIndex.options = { map: new Map<string, number>() }
    processIndex.options.map.set('0', -1)
  }
  const _options = processIndex.options
  const params = _params.split(',')
  const step = parseInt(params[0] || '1')
  const id = params[1] || '0'
  if (params[2]) _options.map.set(id, parseInt(params[2]))
  _options.map.set(id, (_options.map.get(id) ?? -1) + step)

  return '' + _options.map.get(id)
}

export const processSet: Processor<{ storage: string[] }> = _params => {
  processSet.options ||= { storage: [] }
  const _options = processSet.options
  _options.storage.push(_params)
  return _params
}

export const processGet: Processor<{ storage: string[] }> = _params => {
  processGet.options ||= processSet.options
  const _options = processGet.options || { storage: [] }
  const params = _params.split(',')
  let index = parseInt(params[0] || '')
  if (isNaN(index)) index = -1
  if (index < 0) index += _options.storage.length
  return _options.storage[index] || ''
}

export const processCalc: Processor = _params => {
  const expression = _params || `''`
  const fun = new Function('obj', `with(obj){v=(${expression})};return obj.v`)
  const res = new Proxy(
    { v: '' },
    {
      has: (_, k) => {
        if (k !== 'v') throw new Error()
        return true
      }
    }
  )
  try {
    fun(res)
  } catch {
    return ''
  }
  return String(res.v || '')
}
