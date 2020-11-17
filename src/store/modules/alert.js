export default {
  namespaced: true,
  state: {
    type: null,
    message: null
  },
  actions: {
    success({ commit }, message) {
      commit('success', message)
    },
    error({ commit }, message) {
      commit('error', message)
    },
    clear({ commit }) {
      commit('clear')
    }
  },
  mutations: {
    success(state, message) {
      state.message = null
      // setTimeout needed to animate when message changes, as per MD spec snackbars should't stack, but instead close and reopen.
      // https://github.com/vuetifyjs/vuetify/issues/2384
      setTimeout(() => {
        state.message = message
        state.type = 'success'
      }, 250)
    },
    error(state, message) {
      state.message = null
      // setTimeout needed to animate when message changes, as per MD spec snackbars should't stack, but instead close and reopen.
      // https://github.com/vuetifyjs/vuetify/issues/2384
      setTimeout(() => {
        state.message = message
        state.type = 'error'
      }, 250)
    },
    clear(state) {
      state.type = null
      state.message = null
    }
  }
}
