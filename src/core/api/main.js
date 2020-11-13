import { API_HOST } from '@/core/config'
import axios from 'axios'
import { objToParams } from '@/core/helpers/url'
import { retrieveFromCookieStore } from '@/core/helpers/storage'
import router from '@/router'
import store from '@/store'
import { t } from '@/core/helpers/i18n'

export default class API {
  constructor() {
    this.request = axios.create({
      baseURL: API_HOST,
      paramsSerializer: params => objToParams(params)
    })

    this.request.interceptors.request.use(async config => {
      const token = await retrieveFromCookieStore('accessToken')

      config.headers.Authorization = (token && `Bearer ${token}`) || ''

      return config
    })

    this.request.interceptors.response.use(
      response => response,
      async error => {
        const { status } = error?.response

        if (status === 401) {
          const { config } = error
          const { url, __isRetryRequest } = config

          if (url !== '/api/token/') {
            if (!__isRetryRequest) {
              await store.dispatch('auth/refreshTokens')
              return setTimeout(() => this.request(config), 300)
            }

            // TODO: show alert error
            console.error(t('common.error.auth.not-valid'))

            return router.push({ name: 'auth.logout' })
          }
        }

        return Promise.reject(error)
      }
    )
  }
}
