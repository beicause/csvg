import * as m from 'monaco-editor'
import { initOptions } from './options'
import { watchEffect } from 'vue'
import { Compiler } from 'csvg'
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
  src: string
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

  const editor = monaco.editor.create(document.getElementById('source')!, {
    value:
      persistedState.src ||
      `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      |@re!(<circle class="bubble" id="bubble-@i()" cx="@set(@ra(100))" cy="@set(@ra(100))"
      |    transform-origin="@calc(@get(@i(1,1)) + 10) @calc(@get(@i(1,1)) + 10)" r="1.5"></circle>
      |    ,100)
      |  <style>
      |    /*reset index @i(0,0,-1) */
      |    @re!(
      |      #bubble-@i() {
      |        animation-duration: 6s;
      |        animation-delay: @calc(@set(@ra(1, 2))>1.5?@get():3+@get())s;
      |      }, 100)
      |      
      |    .bubble {
      |      fill: transparent;
      |      animation-name: flash, zoom;
      |      animation-timing-function: linear;
      |      animation-iteration-count: infinite;
      |    }
      |
      |    @keyframes flash {
      |      0% {
      |        fill: transparent;
      |      }
      |
      |      8.33% {
      |        fill: #cd1818;
      |      }
      |
      |      16.66% {
      |        fill: #fff323;
      |      }
      |
      |      24.99% {
      |        fill: #cd1818;
      |      }
      |
      |      33.33% {
      |        fill: transparent;
      |      }
      |
      |      100% {
      |        fill: transparent;
      |     }
      |    }
      |    
      |    @keyframes zoom {
      |      0% {
      |        transform: scale(0);
      |      }
      |
      |      16.66% {
      |        transform: scale(1.2);
      |      }
      |
      |      33.33% {
      |        transform: scale(0);
      |      }
      |
      |      100% {
      |        transform: scale(0);
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
      src
    })
    localStorage.setItem('state', state)

    let res = ''
    try {
      res = new Compiler().compile(src)
    }
    catch (e) {
      console.error(e)
    }
    output.setValue(res)
    svg.innerHTML = res
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
