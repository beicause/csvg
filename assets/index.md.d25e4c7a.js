import{_ as a,c as e,o as s,a as n}from"./app.7f688f53.js";const h='{"title":"What is csvg?","description":"","frontmatter":{},"headers":[{"level":2,"title":"Get Start","slug":"get-start"}],"relativePath":"index.md","lastUpdated":1639758941112}',t={},o=n(`<h1 id="what-is-csvg" tabindex="-1">What is csvg? <a class="header-anchor" href="#what-is-csvg" aria-hidden="true">#</a></h1><p>Scalable Vector Graphics, <a href="https://developer.mozilla.org/en-US/docs/Web/SVG" target="_blank" rel="noopener noreferrer">SVG</a> is excellent way to draw beautiful images on web. Generally, we use SVG editors to make SVG images. However, most SVG editors do not yet support animation, and they are not flexible for developers. CSVG is a preprocessor with some useful functions for drawing and make CSS animation or <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/SVG_animation_with_SMIL" target="_blank" rel="noopener noreferrer">SMIL</a> animation in SVG easier.</p><h2 id="get-start" tabindex="-1">Get Start <a class="header-anchor" href="#get-start" aria-hidden="true">#</a></h2><p>You can <a href="https://csvg-explorer.netlify.app" target="_blank" rel="noopener noreferrer">Try it online</a> and see the example.<br> Install it with npm.</p><div class="language-sh"><pre><code> npm install csvg
</code></pre></div><p>Then import <code>Compiler</code> to process your svg string.</p><div class="language-ts"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Compiler <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;csvg&#39;</span>
<span class="token comment">// use Compiler&#39;s processors</span>
<span class="token keyword">const</span> output <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Compiler</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">compile</span><span class="token punctuation">(</span>svg<span class="token punctuation">)</span>
<span class="token comment">// use svgo optimizer</span>
<span class="token keyword">const</span> optimized <span class="token operator">=</span> Compiler<span class="token punctuation">.</span><span class="token function">optimize</span><span class="token punctuation">(</span>output<span class="token punctuation">,</span>config<span class="token punctuation">)</span>
</code></pre></div>`,7),p=[o];function r(c,i,l,d,u,m){return s(),e("div",null,p)}var _=a(t,[["render",r]]);export{h as __pageData,_ as default};