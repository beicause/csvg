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
            |    @re(<circle cx="@ra(2,98)" cy="@ra(2,98)" r="1"/>
            |    ,100)
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
    const res = new Compiler().compile(src)
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
  editor.onDidChangeModelContent(debounce(reCompile))
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
