export default {
  namespaced: true,
  state: {
    offline: false
  },
  mutations: {
    setOnline(state) {
      state.offline = false
    },
    setOffline(state) {
      state.offline = true
    }
  },
  actions: {}
}
