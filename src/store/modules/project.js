import { Project } from '@/core/api'
import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    projects: {}
  },
  getters: {
    list(state) {
      return state.projects
    }
  },
  actions: {
    get(state, id) {
      return state.projects[id] || null
    },
    async list({ commit }) {
      const { data } = await Project.list()

      data.results.forEach(item => commit('set', item))
    },
    async create({ commit }, payload) {
      const { data } = await Project.create(payload)

      commit('set', data)
    },
    async update({ commit }, payload) {
      const { id } = payload

      const { data } = await Project.update(id, payload)

      commit('set', data)
    },
    async delete({ commit }, id) {
      await Project.delete(id)

      commit('delete', id)
    }
  },
  mutations: {
    set(state, project = {}) {
      if (!project?.id) {
        return
      }

      state.project = Object.assign({}, state.projects, {
        [project.id]: project
      })
    },
    remove(state, id) {
      Vue.delete(state.projects, id)
    }
  }
}
