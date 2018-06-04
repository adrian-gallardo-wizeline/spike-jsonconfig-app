module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'app',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'}
    ]
  },
  env: {
    API_URL: 'http://api.jsonconfig.com:1337',
    CODEMIRROR_CONFIG: {
      mode: { name: "javascript", json: true },
      indentUnit: 4,
      smartIndent: true,
      tabSize: 4,
      electricChars: true,
      lineNumbers: true,
      lineWrapping: true,
      foldGutter: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    }
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    vendor: ['axios'],
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  modules: [
    'semantic-ui-vue/nuxt', // includes styles from semantic-ui-css
    // ['sematic-ui-vue/nuxt', { css: false }] // if you have your own semantic-ui styles
  ],
  plugins: [
    { src: '~/plugins/vue-codemirror', ssr: false },
    { src: '~/plugins/vue-notifications', ssr: false },
    { src: '~/plugins/vue-elementui' },
    //{ src: '~/plugins/vue-async-computed' },
    { src: '~/plugins/vue-async-directive' },
  ]
}
