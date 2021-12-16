export interface FunctionExpression {
  name: string
  params: { content: string, functions?: FunctionExpression[] }
  range: [number, number]
  content: string
}

interface Pair {
  start: RegExpMatchArray
  end: RegExpMatchArray
  children?: Pair[]
}

export function parse(input: string, prefix: string, postfix: string) {
  const functions = [] as FunctionExpression[]
  // resolve paired parentheses
  const pairs = [] as Pair[]
  const stack = [] as Pair[]
  const words = input.matchAll(new RegExp(`${prefix}\\w*?${postfix ? postfix + '?' : ''}\\(|\\)`, 'g'))
  for (const word of words) {
    const top = stack[stack.length - 1]
    if (word[0] !== ')') {
      if (top) {
        top.children ||= []
        top.children.push({ start: word, end: [] })
      }
      const open = { start: word, end: [] }
      pairs.push(open)
      stack.push(open)
    }
    else {
      const open = stack.pop()
      if (open) open.end = word
    }
  }
  pairs.forEach((p, i, a) => {
    if (p.end.length === 0) a.splice(i, 1)
  })
  // resolve functions
  pairs.reverse()
  pairs.forEach(pair => {
    const name = pair.start[0].slice(0, -1)
    const range = [pair.start.index, pair.end.index! + 1] as [number, number]
    const content = pair.start.input!.substring(range[0], range[1])
    const params = { content: input.substring(range[0] + name.length + 1, range[1]-1) } as { content: string, functions?: FunctionExpression[] }

    if (pair.children) {
      for (let i = 0; i < pair.children.length; i++) {
        const fun = functions.pop()!
        params.functions ||= []
        params.functions.unshift(fun)
      }
    }
    functions.push({ name, content, range, params })
  })
  functions.reverse()
  return functions
}
