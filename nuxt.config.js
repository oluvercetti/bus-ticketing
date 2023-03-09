import { env } from "./config/env";
import { store } from './store'
/** Get host and port from BASE_URL */
const [HOST, PORT] = env.BASE_URL.replace(
  new RegExp(/^https?:\/\//),
  ''
).split(':')

export default {
  env,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Bus Ticketing',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios',
    '~plugins/filters'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    ['@nuxtjs/moment']
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    ["cookie-universal-nuxt", { alias: "cookies" }],
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  bootstrapVue: {
    // Install the `IconsPlugin` plugin (in addition to `BootstrapVue` plugin)
    icons: true
  },

  /** Define server host and port */
  server: {
    host: HOST,
    port: PORT,
  },

  /** Express server */
  serverMiddleware: ['~/server/express.js'],

}
