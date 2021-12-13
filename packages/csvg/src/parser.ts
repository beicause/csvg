
export interface FunctionExpression {
    name: string,
    params: (string | FunctionExpression)[],
    range: [number, number],
    content: string
}

interface Pair {
    start: RegExpMatchArray, end: RegExpMatchArray, child?: Pair
}

export function parse(input: string, sign: string) {
    const functions = [] as FunctionExpression[]
    // resolve paired parentheses
    const pairs = [] as Pair[]
    const stack = [] as RegExpMatchArray[]
    const words = input.matchAll(new RegExp(sign + '\\w*?\\(|\\)', 'g'))
    let hasChild = false
    for (const word of words) {
        if (word[0] !== ')') stack.push(word)
        else {
            const start = stack.pop()
            const end = word
            if (start) {
                let child: Pair | undefined
                if (hasChild) child = pairs[pairs.length - 1]
                pairs.push({ start, end, child })
                hasChild = stack.length > 0
            }
        }
    }
    // resolve functions
    pairs.forEach(pair => {
        const name = pair.start[0].slice(0, -1)
        const range = [pair.start.index, pair.end.index] as [number, number]
        const content = pair.start.input!.substring(range[0], range[1] + 1)

        if (!pair.child) {
            const params = input.substring(range[0] + name.length + 1, range[1]).split(',').filter(s => !!s)
            functions.push({ name, range, content, params })
        }
        else {
            const childAsParams = functions.pop()!
            const preParams = input.substring(range[0] + name.length + 1, pair.child.start.index!)
            const nextParams = input.substring(pair.child.end.index! + 1, range[1])
            const params = [...preParams.split(',').filter(s => !!s), childAsParams, ...nextParams.split(',').filter(s => !!s)]
            functions.push({ name, range, content, params })
        }
    })
    return functions
}
