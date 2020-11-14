import { AUTH_COOKIES, REFRESH_TOKENS_INTERVAL } from '@/core/config'
import { addToCookieStore, retrieveFromCookieStore } from '@/core/helpers/storage'
import { Auth } from '@/core/api'
import { signOut } from '@/core/helpers/auth'

export default {
  namespaced: true,
  state: {
    isAuthRequired: false,
    isAuthVerified: false,
    isUserLoggedIn: false,
    accessToken: null,
    refreshToken: null,
    expiresAt: null
  },
  getters: {
    isAuthRequired(state) {
      return state.isAuthRequired
    },
    isAuthVerified(state) {
      return state.isAuthVerified
    },
    isUserLoggedIn(state) {
      return state.isUserLoggedIn
    }
  },
  actions: {
    async init({ state }) {
      ;(state.accessToken = (await retrieveFromCookieStore(AUTH_COOKIES.ACCESS_TOKEN)) || null),
        (state.refreshToken = (await retrieveFromCookieStore(AUTH_COOKIES.REFRESH_TOKEN)) || null),
        (state.expiresAt = (await retrieveFromCookieStore(AUTH_COOKIES.EXPIRES_AT)) || null)
    },
    requiresAuth({ commit }, payload) {
      commit('setRequiredAuth', payload)
    },
    async login({ commit }, payload = {}) {
      const { username, apiKey } = payload
      const { access, refresh } = await Auth.token(username, apiKey)

      commit('setTokens', { access, refresh })
      commit('setAuthVerified', true)
    },
    logout({ commit }) {
      commit('clearTokens')
    },
    async toggleUserLoggedIn({ commit }, payload) {
      commit('setUserLoggedIn', payload)
    },
    async refreshTokens({ commit }) {
      const expiresAt = Number(await retrieveFromCookieStore(AUTH_COOKIES.ACCESS_TOKEN))
      const refreshToken = await retrieveFromCookieStore(AUTH_COOKIES.REFRESH_TOKEN)

      if (!refreshToken || expiresAt > Date.now()) {
        return
      }

      const { access } = await Auth.refreshTokens(refreshToken)

      commit('setTokens', { access })
      commit('setAuthVerified', true)
    },
    async verify({ state, commit }) {
      if (!state.accessToken) {
        return
      }

      await Auth.verifyToken(state.accessToken)
      commit('setAuthVerified', true)
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
      state.isAuthVerified = false

      state.accessToken = null
      state.refreshToken = null
      state.expiresAt = null
    },
    setUserLoggedIn(state, flag) {
      state.isUserLoggedIn = flag
    },
    setRequiredAuth(state, flag) {
      state.isAuthRequired = flag
    },
    setAuthVerified(state, flag) {
      state.isAuthVerified = flag
    }
  }
}
