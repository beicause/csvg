import * as m from 'monaco-editor'
import { initOptions } from './options'
import { watchEffect } from 'vue'
import { Compiler, compileRandom, compileRepeat } from 'svg-macro'
import './index.css'

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
    const persistedState: PersistedState = JSON.parse(localStorage.getItem('state') || '{}')

    const editor = monaco.editor.create(document.getElementById('source')!, {
        value: decodeURIComponent(window.location.hash.slice(1)) || persistedState.src ||
            `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            |    #repeat(<circle cx="#random(2,98)" cy="#random(2,98)" r="1"/>
            |    ,100)
            |</svg>`.replace(/\n\s*?\|/g, '\n'),
        language: 'xml',
        tabSize: 2
    })

    const output = monaco.editor.create(document.getElementById('code')!, {
        value: '',
        language: 'xml',
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
        window.location.hash = encodeURIComponent(src)
        const res = new Compiler()
            .use(compileRepeat(), compileRandom())
            .compile(src)
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

function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay = 300): T {
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
