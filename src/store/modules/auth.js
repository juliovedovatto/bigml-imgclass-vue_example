import { addToCookieStore, retrieveFromCookieStore } from '@/core/helpers/storage'
import { Auth } from '@/core/api'
import { REFRESH_TOKENS_INTERVAL } from '@/core/config'
import { signOut } from '@/core/helpers/auth'

export default {
  namespaced: true,
  state: {
    isUserLoggedIn: false,
    accessToken: retrieveFromCookieStore('accessToken') || null,
    refreshToken: retrieveFromCookieStore('refreshToken') || null,
    expiresAt: retrieveFromCookieStore('expiresAt') || null
  },
  actions: {
    async login({ commit }, payload = {}) {
      const { access, refresh } = await Auth.token(payload.username, payload.apiKey)

      commit('setTokens', { access, refresh })
    },
    logout({ commit }) {
      commit('clearTokens')
    },
    toggleUserLoggedIn({ commit }, state) {
      commit('setUserLoggedIn', state)
    }
  },
  mutations: {
    setTokens(state, { access, refresh }) {
      const expiresInSecs = Math.floor(Number(REFRESH_TOKENS_INTERVAL))
      const expiresAt = new Date().getTime() + expiresInSecs * 500

      addToCookieStore('accessToken', access, expiresInSecs)
      addToCookieStore('refreshToken', refresh, expiresInSecs)
      addToCookieStore('expiresAt', expiresAt, expiresInSecs)

      state.isUserLoggedIn = true
      state.accessToken = access
      state.refreshToken = refresh
      state.expiresAt = expiresInSecs
    },
    clearTokens(state) {
      signOut()
      state.isUserLoggedIn = false
      state.accessToken = null
      state.refreshToken = null
      state.expiresAt = null
    },
    setUserLoggedIn(state, flag) {
      state.isUserLoggedIn = flag
    }
  }
}
