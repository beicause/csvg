import {
  h, createApp,
} from 'vue'

const App = {
  setup() {
    return () => [
      h('h1', 'Csvg Explorer'),
      h(
        'a',
        {
          href: 'https://github.com/beicause/csvg',
          target: '_blank',
        },
        'GitHub',
      ),

      h('div', { id: 'options-wrapper' }, [
        h('div', { id: 'options-label' }, 'Options ↘'),
        h('ul', { id: 'options' })
      ])
    ]
  }
}

export function initOptions() {
  createApp(App).mount('#header')
}
