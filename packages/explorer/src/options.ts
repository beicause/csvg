import { h, createApp, reactive } from 'vue'

export const compilerOptions = reactive({
  optimize: false
})
const App = {
  setup() {
    return () => [
      h('h1', 'CSVG Explorer'),
      h(
        'a',
        {
          href: 'https://github.com/beicause/csvg',
          target: '_blank'
        },
        'GitHub'
      ),

      h('div', { id: 'options-wrapper' }, [
        h('div', { id: 'options-label' }, 'Options ↘'),
        h('ul', { id: 'options' }, [
          // optimize
          h('li', [
            h('input', {
              type: 'checkbox',
              id: 'optimize',
              name: 'optimize',
              checked: compilerOptions.optimize,
              onChange(e: Event) {
                compilerOptions.optimize = (
                  e.target as HTMLInputElement
                ).checked
              }
            }),
            h('label', { for: 'optimize' }, 'optimize')
          ])
        ])
      ])
    ]
  }
}

export function initOptions() {
  createApp(App).mount('#header')
}
