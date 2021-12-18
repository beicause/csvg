import * as m from 'monaco-editor'
import { compilerOptions, initOptions } from './options'
import { watchEffect } from 'vue'
import { Compiler } from 'csvg/dist/browser'
import './index.css'
import {
  getXmlCompletionProvider,
  getXmlHoverProvider
} from './completion-provider'

declare global {
  interface Window {
    monaco: typeof m
  }
}
interface PersistedState {
  src?: string
  options?: typeof compilerOptions
}

const init = () => {
  const monaco = window.monaco
  monaco.editor.setTheme('vs-dark')
  // register a completion item provider for xml language
  monaco.languages.registerCompletionItemProvider(
    'html',
    getXmlCompletionProvider(monaco)
  )
  monaco.languages.registerHoverProvider('html', getXmlHoverProvider(monaco))
  const persistedState: PersistedState = JSON.parse(
    localStorage.getItem('state') || '{}'
  )

  Object.assign(compilerOptions, persistedState.options)

  const editor = monaco.editor.create(document.getElementById('source')!, {
    value:
      persistedState.src ||
      `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      |@re!(<circle class="bubble" id="bubble-@i()" cx="@set(@ra(100))" cy="@set(@ra(100))"
      |    transform-origin="@calc(@get(@i(1,1)) + 3) @calc(@get(@i(1,1)) + 3)" r="2"></circle>
      |    ,100)
      |  <style>
      |    /*reset index @i(0,0,-1) */
      |    @re!(
      |      #bubble-@i() {
      |        animation-delay: @calc(@set(@ra(0, 4))>3?@ra(1,2):@get()<1?2.5+@ra(1,2):@get()>2?5+@ra(1,2):7.5+@ra(1,2))s;
      |        animation-duration: 10s;
      |      }, 100)
      |
      |    .bubble {
      |      fill: transparent;
      |      animation-name:  zoom;
      |      animation-timing-function: linear;
      |      animation-iteration-count: infinite;
      |    }
      |
      |    @keyframes zoom {
      |     0% {
      |       transform: scale(0);
      |        fill: transparent;
      |      }
      |      3% {
      |        fill: #cd1818;
      |      }
      |      6% {
      |        transform: scale(1.2);
      |        fill: #fff323;
      |      }
      |      9% {
      |        fill: #cd1818;
      |      }
      |      12% {
      |        transform: scale(0);
      |        fill: transparent;
      |      }
      |      100% {
      |        transform: scale(0);
      |        fill: transparent;
      |      }
      |    }
      |  </style>
      |</svg>`.replace(/\n\s*?\|/g, '\n'),
    language: 'html',
    tabSize: 2
  })

  const output = monaco.editor.create(document.getElementById('code')!, {
    value: '',
    language: 'html',
    readOnly: true,
    tabSize: 2
  })

  const svg = document.getElementById('svg')!

  const reCompile = () => {
    const src = editor.getValue()
    const state = JSON.stringify({
      src,
      options: compilerOptions
    } as PersistedState)
    localStorage.setItem('state', state)

    const compile = async () => {
      let res = new Compiler().compile(src)
      if (compilerOptions.optimize) res = (await Compiler.optimize(res)).data
      return res
    }
    compile().then((res) => {
      output.setValue(res)
      svg.innerHTML = res
    })
  }

  // handle resize
  window.addEventListener('resize', () => {
    editor.layout()
    output.layout()
  })

  initOptions()
  watchEffect(reCompile)

  // update compile output when input changes
  editor.onDidChangeModelContent(debounce(reCompile, 1000))
}

function debounce<T extends (...args: any[]) => any>(fn: T, delay = 300): T {
  let prevTimer: number | null = null
  return ((...args: any[]) => {
    if (prevTimer) {
      clearTimeout(prevTimer)
    }
    prevTimer = window.setTimeout(() => {
      fn(...args)
      prevTimer = null
    }, delay)
  }) as any
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
require(['vs/editor/editor.main'], init)
