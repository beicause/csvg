# csvg

![npm version](https://img.shields.io/npm/v/csvg.svg)
![npm downloads](https://img.shields.io/npm/dt/csvg.svg)
![tests](https://img.shields.io/github/workflow/status/beicause/csvg/Test)

> Experimental  

CSVG is a preprocessor with some useful functions for drawing and make CSS animation or [SMIL](https://developer.mozilla.org/en-US/docs/Web/SVG/SVG_animation_with_SMIL) animation in SVG easier.(Actually it's not limited to this, any string is ok)  

## Documentation

please visit [beicause.github.io/csvg](https://beicause.github.io/csvg).

## Get Start

You can [Try it online](https://csvg-explorer.netlify.app) and see the example.    
Install it with npm.

```sh
 npm install csvg
 ```

 then import `Compiler` to process your svg string.
 

```ts
import { Compiler } from 'csvg'
// use Compiler's processors
const output = new Compiler().compile(svg)
// use svgo optimizer
const optimized = await Compiler.optimize(output,config)
 ```
