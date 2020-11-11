import '@/assets/scss/main.scss'

import * as Integrations from '@sentry/integrations'
import * as Sentry from '@sentry/browser'

import { APP_VERSION, ENVIRONMENT, SENTRY_DSN } from '@/core/config'

import App from './App.vue'
import Vue from 'vue'

import i18n from './plugins/i18n'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

if (ENVIRONMENT === 'production' && SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    release: APP_VERSION,
    integrations: [new Integrations.Vue({ Vue })]
  })
}

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
