export default {
  lang: 'en-US',
  title: 'csvg',
  description: '',
  base:'/csvg/',
  themeConfig: {
    repo: 'beicause/csvg',
    docsDir: 'docs',
    docsBranch: 'master',
    nav: [
      { text: 'Guide', link: '/', activeMatch: '^/$|^/guide/' },
      {
        text: 'Release Notes',
        link: 'https://github.com/beicause/csvg/releases'
      }
    ],

    sidebar: {
      '/': [
        {
          text: 'Guide',
          children: [
            { text: 'Introduction', link: '/' },
            { text: 'Functions', link: '/guide/function' },
            { text: 'API', link: '/guide/api' }
          ]
        }
      ]
    }
  }
}
