import { addToCookieStore, retrieveFromCookieStore } from '@/core/helpers/storage'
import { Auth } from '@/core/api'
import { REFRESH_TOKENS_INTERVAL } from '@/core/config'

export default {
  namespaced: true,
  state: {
    accessToken: retrieveFromCookieStore('accessToken') || null,
    refreshToken: retrieveFromCookieStore('refreshToken') || null,
    expiresAt: retrieveFromCookieStore('expiresAt') || null
  },
  actions: {
    async login({ commit }, payload = {}) {
      const { access, refresh } = await Auth.token(payload.username, payload.apiKey)

      commit('setTokens', { access, refresh })
    }
  },
  mutations: {
    setTokens(state, { access, refresh }) {
      const expiresInSecs = Math.floor(Number(REFRESH_TOKENS_INTERVAL))
      const expiresAt = new Date().getTime() + expiresInSecs * 500

      addToCookieStore('accessToken', access, expiresInSecs)
      addToCookieStore('refreshToken', refresh, expiresInSecs)
      addToCookieStore('expiresAt', expiresAt, expiresInSecs)

      state.accessToken = access
      state.refreshToken = refresh
    }
  }
}
