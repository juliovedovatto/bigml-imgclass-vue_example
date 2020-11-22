import { UNAUTHORIZED_WHITELIST } from '@/core/config'
import router from '@/router'
import store from '@/store'
import { t } from '@/core/helpers/i18n'

export default [
  response => response,
  async err => {
    const { status = null } = err?.response || {}

    if (status === 401) {
      const { config } = err
      const { url, __isRetryRequest } = config

      if (!UNAUTHORIZED_WHITELIST.includes(url)) {
        if (!__isRetryRequest) {
          await store.dispatch('auth/refreshTokens')
          return setTimeout(() => this.request(config), 300)
        }

        // TODO: show alert error
        console.error(t('common.error.auth.not-valid'))

        return router.push({ name: 'auth.logout' })
      }
    }

    return Promise.reject(err)
  }
]
