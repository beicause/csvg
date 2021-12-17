# What is csvg?

Scalable Vector Graphics, [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG) is excellent way to draw beautiful images on web. Generally, we use SVG editors to make SVG images. However, most SVG editors do not yet support animation, and they are not flexible for developers. CSVG is a preprocessor with some useful functions for drawing and make CSS animation or [SMIL](https://developer.mozilla.org/en-US/docs/Web/SVG/SVG_animation_with_SMIL) animation in SVG easier.  

## Get Start

You can [Try it online](https://csvg-explorer.netlify.app) and see the example.    
Install it with npm.

```sh
 npm install csvg
 ```

 Then import `Compiler` to process your svg string.
 

```ts
import { Compiler } from 'csvg'
// use Compiler's processors
const output = new Compiler().compile(svg)
// use svgo optimizer
const optimized = Compiler.optimize(output,config)
 ```
