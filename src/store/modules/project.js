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
    projectList(state) {
      return state.projects
    },
    currentProject(state) {
      return state.currentProject
    },
    currentImages(state) {
      return state.currentImages
    }
  },
  actions: {
    async getProject({ commit }, payload) {
      const { id } = payload
      const { data } = await Project.get(id)
      commit('setCurrentProject', data)
      return data
    },
    clear({ commit }) {
      commit('clear')
    },
    async listProjects({ commit }) {
      const { data } = await Project.list()
      console.log('Listing Projects', { id: data?.results[0]?.id })
      data.results.forEach(item => commit('setProject', item))
    },
    setCurrentProject({ commit, dispatch, state }, payload) {
      const { id } = payload
      const { projects } = state
      commit('setCurrentProject', projects[id])
      dispatch('listImagesFromProject', { id })
    },
    async listImagesFromProject({ commit }, payload) {
      const { id } = payload
      const { data } = await Project.listImages(id)
      data.results.forEach(item => commit('setCurrentImage', item))
    },
    async create({ commit }, payload) {
      const { data } = await Project.create(payload)
      commit('setProject', data)
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
    pollImageBundle({ dispatch }, payload) {
      const { bundleId, projectId } = payload
      async function checkIfReady() {
        const {
          data: { status }
        } = await dispatch('getImageBundle', { projectId, bundleId })
        if (status === 'READY') {
          console.log('Bundle is ready')
          dispatch('listProjects')
          dispatch('listImagesFromProject', { id: projectId })
          clearInterval(pool)
        } else {
          console.log('Bundle isnt ready yet', { status })
        }
      }
      checkIfReady()
      const pool = setInterval(checkIfReady, 5000)
    },
    pollProject({ commit, dispatch }, payload) {
      const { id } = payload
      async function checkIfReady() {
        const project = await dispatch('getProject', { id })
        const { status } = project
        if (status === 'READY') {
          console.log('Project is ready')
          dispatch('listImagesFromProject', { id })
          commit('setProject', project)
          clearInterval(pool)
        } else {
          console.log('Project isnt ready yet', { status })
        }
      }
      checkIfReady()
      const pool = setInterval(checkIfReady, 5000)
    }
  },
  mutations: {
    setProject(state, project = {}) {
      if (!project?.id) {
        return
      }

      state.projects = Object.assign({}, state.projects, {
        [project.id]: project
      })
    },
    clear(state) {
      state.currentProject = {}
      state.currentImages = {}
    },
    setCurrentProject(state, currentProject = {}) {
      if (!currentProject?.id) {
        return
      }

      state.currentProject = Object.assign({}, currentProject)
    },
    setCurrentImage(state, currentImage = {}) {
      if (!currentImage?.id) {
        return
      }

      state.currentImages = Object.assign({}, state.currentImages, {
        [currentImage.id]: currentImage
      })
    },
    // setImage(state, project = {}) {
    //   if (!image?.id) {
    //     return
    //   }

    //   state.projects = Object.assign({}, state.projects, {
    //     [project.id]: project
    //   })
    // },
    remove(state, id) {
      Vue.delete(state.projects, id)
    }
  }
}
