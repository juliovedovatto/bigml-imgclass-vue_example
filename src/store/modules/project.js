import { Project } from '@/core/api'
import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    projects: {},
    currentProject: {
      // selected project data
    },
    currentImages: {
      // selected project images
    }
  },
  getters: {
    list(state) {
      return state.projects
    }
  },
  actions: {
    async get({ state }, id) {
      const { data } = await Project.get(id)
      console.log('Listing Project', { id, data, test: state.projects[id] })
      return data
    },
    async list({ commit }) {
      const { data } = await Project.list()
      console.log('Listing Projects', { id: data?.results[0]?.id })
      data.results.forEach(item => commit('set', item))
    },
    async listImagesFromProject({ commit }, payload) {
      const { data } = await Project.listImages(payload.id)
      console.log('Listing Images from Projects', { data, commit })
      // data.results.forEach(item => commit('set', item))
    },
    async create({ commit }, payload) {
      const { data } = await Project.create(payload)
      commit('set', data)
      return data
    },
    async createImageBundle(_, payload) {
      const { id, file } = payload
      const { data } = await Project.createImageBundle(id, file)
      return data
    },
    async update({ commit }, payload) {
      const { id } = payload

      const { data } = await Project.update(id, payload)

      commit('set', data)
    },
    async delete({ commit }, id) {
      await Project.delete(id)

      commit('delete', id)
    },
    async getImageBundle(_, payload) {
      const { projectId, bundleId } = payload
      const data = await Project.getImageBundle(projectId, bundleId)
      return data
    },
    pool({ dispatch }, payload) {
      // separate polling
      const { data, actionName } = payload
      async function checkIfReady() {
        const {
          data: { status }
        } = await dispatch(actionName, data)
        if (status === 'READY') {
          console.log('its ready')
          // get images
          clearInterval(pool)
        } else {
          console.log('not ready yet', { status })
        }
      }
      checkIfReady()
      const pool = setInterval(checkIfReady, 5000)
    }
  },
  mutations: {
    set(state, project = {}) {
      if (!project?.id) {
        return
      }

      state.projects = Object.assign({}, state.projects, {
        [project.id]: project
      })
    },
    remove(state, id) {
      Vue.delete(state.projects, id)
    }
  }
}
