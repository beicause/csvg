# API

## Parser

```ts
function parse(input: string, prefix: string, postfix: string): FunctionExpression[];

interface FunctionExpression {
  name: string
  params: { content: string; functions?: FunctionExpression[] }
  range: [number, number]
  content: string
}
```

## Processor

see [src/processor.ts](https://github.com/beicause/csvg/blob/master/packages/csvg/src/process.ts) for detailed options

```ts
interface Processor<T = any> {
  (params: string): string
  options?: T
}
const processRandom: Processor<{
    seed: { value: number; }; // Initial seed for generate random number
    fractionDigits: number; // fraction digits of random number
}>;
const processRepeat: Processor;
const processIndex: Processor<{
    map: Map<string, number>; // Map: id of each increasing => saved number
}>;
const processSet: Processor<{
    storage: string[]; // shared with get
}>;
const processGet: Processor<{
    storage: string[]; // shared with set
}>;
const processCalc: Processor;
```

## Compiler

```ts
class Compiler {
    prefix: string; // prefix added to function name
    postfix: string; // postfix of high priority function
    processors: Map<string, Processor<any>>; // Map: function name => processor to hand it
    constructor();
    use(name: string, processor: Processor): this; // insert the pair into this.processors 
    remove(name: string): this; // remove the pair from this.processors
    compile(input: string): string; // use this.processors to process input and return the result
    static optimize(input: string, config?: OptimizeOptions): Promise<import("svgo").OptimizedSvg>; // use svgo
}
```
