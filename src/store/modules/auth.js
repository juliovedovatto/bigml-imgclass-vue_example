import { AUTH_COOKIES, REFRESH_TOKENS_INTERVAL } from '@/core/config'
import { addToCookieStore, retrieveFromCookieStore } from '@/core/helpers/storage'
import { Auth } from '@/core/api'
import { signOut } from '@/core/helpers/auth'

export default {
  namespaced: true,
  state: {
    isUserLoggedIn: false,
    accessToken: retrieveFromCookieStore(AUTH_COOKIES.ACCESS_TOKEN) || null,
    refreshToken: retrieveFromCookieStore(AUTH_COOKIES.REFRESH_TOKEN) || null,
    expiresAt: retrieveFromCookieStore(AUTH_COOKIES.EXPIRES_AT) || null
  },
  actions: {
    async login({ commit }, payload = {}) {
      const { username, apiKey } = payload
      const { access, refresh } = await Auth.token(username, apiKey)

      commit('setTokens', { access, refresh })
    },
    logout({ commit }) {
      commit('clearTokens')
    },
    toggleUserLoggedIn({ commit }, state) {
      commit('setUserLoggedIn', state)
    },
    async refreshTokens({ commit }) {
      const expiresAt = Number(await retrieveFromCookieStore(AUTH_COOKIES.ACCESS_TOKEN))
      const refreshToken = await retrieveFromCookieStore(AUTH_COOKIES.REFRESH_TOKEN)

      if (!refreshToken || expiresAt > Date.now()) {
        return
      }

      const { access } = await Auth.refreshTokens(refreshToken)

      commit('setTokens', { access })
    }
  },
  mutations: {
    setTokens(state, { access, refresh = null }) {
      const expiresInSecs = Math.floor(Number(REFRESH_TOKENS_INTERVAL))
      const expiresAt = new Date().getTime() + expiresInSecs * 500

      addToCookieStore(AUTH_COOKIES.ACCESS_TOKEN, access, expiresInSecs)
      addToCookieStore(AUTH_COOKIES.EXPIRES_AT, expiresAt, expiresInSecs)

      state.isUserLoggedIn = true
      state.accessToken = access
      state.expiresAt = expiresInSecs

      if (refresh) {
        addToCookieStore(AUTH_COOKIES.REFRESH_TOKEN, refresh, expiresInSecs)
        state.refreshToken = refresh
      }
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
