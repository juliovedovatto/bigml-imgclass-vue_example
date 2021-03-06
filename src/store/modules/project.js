import { Project } from '@/core/api'
import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    projects: {},
    currentProject: {},
    currentImages: {},
    currentImageBundle: {},
    currentPredictedImage: {},
    currentPredictedImageList: {}
  },
  getters: {
    projectList(state) {
      return state.projects
    },
    currentProject(state) {
      return state.currentProject
    },
    currentImageBundle(state) {
      return state.currentImageBundle
    },
    currentImages(state) {
      return state.currentImages
    },
    currentPredictedImage(state) {
      return state.currentPredictedImage
    },
    currentPredictedImageList(state) {
      return state.currentPredictedImageList
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
    clearPredictedImages({ commit }) {
      commit('clearPredictedImages')
    },
    clearCurrentPredictedImage({ commit }) {
      commit('clearCurrentPredictedImage')
    },
    async predictImage(_, payload) {
      const { id, file } = payload
      const { data } = await Project.predictImage(id, file)
      return data
    },
    async getPredictedImage(_, payload) {
      const { projectId, id } = payload
      const data = await Project.getPredictedImage(projectId, id)
      return data
    },
    pollPredictedImage({ dispatch, commit }, payload) {
      const { id, projectId } = payload
      async function checkIfReady() {
        const predictedImage = await dispatch('getPredictedImage', { id, projectId })
        const { data = {} } = predictedImage
        const { status } = data
        commit('setCurrentPredictedImage', data)
        if (status === 'READY') {
          dispatch('listPredictedImages', { projectId })
          clearInterval(poll)
        } else if (status === 'ERROR') {
          dispatch('alert/error', 'Sorry we had a problem predicting the image.', { root: true })
          clearInterval(poll)
        }
      }
      checkIfReady()
      const poll = setInterval(checkIfReady, 5000)
    },
    setCurrentPredictedImageFromList({ commit }, payload) {
      commit('setCurrentPredictedImageFromList', payload)
    },
    async listPredictedImages({ commit }, payload) {
      const { projectId } = payload
      const { data } = await Project.listPredictedImages(projectId)
      data.results.forEach(item => commit('setPredictedImage', item))
    },
    async listProjects({ commit }) {
      const { data } = await Project.list()
      data.results.forEach(item => commit('setProject', item))
    },
    setCurrentProject({ commit, dispatch, state }, payload) {
      const { id } = payload
      const { projects } = state
      commit('setCurrentProject', projects[id])
      commit('clearImagesFromProject')
      commit('clearCurrentPredictedImage')
      commit('clearPredictedImages')
      dispatch('listImagesFromProject', { id })
      dispatch('listPredictedImages', { projectId: id })
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
    async createImageBundle({ commit }, payload) {
      const { id, file } = payload
      const { data } = await Project.createImageBundle(id, file)
      commit('setCurrentImageBundle', data)
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
    pollImageBundle({ dispatch, commit }, payload) {
      const { bundleId, projectId } = payload

      Project.checkImageBundle(projectId, bundleId, response => {
        let polling = true
        const { data } = response
        const { status } = data

        switch (status) {
          case 'UPLOADING_TO_BIGML':
            dispatch('listProjects')
            dispatch('listImagesFromProject', { id: projectId })
            dispatch('pollProject', { id: projectId })
            commit('setCurrentImageBundle', data)
            polling = false
            break
          case 'ERROR':
            dispatch('alert/error', 'Sorry we had a problem creating the image bundle.', { root: true })
            polling = false
            break
          default:
        }

        return polling
      })
    },
    pollProject({ commit, dispatch }, payload) {
      const { id } = payload

      Project.check(id, response => {
        let polling = true
        const { data } = response
        const { status } = data

        commit('setCurrentProject', data)

        switch (status) {
          case 'READY':
            dispatch('listImagesFromProject', { id })
            commit('setProject', data)
            polling = false
            break
          case 'ERROR':
            dispatch('alert/error', 'Sorry we had a problem training the project.', { root: true })
            polling = false
            break
          default:
        }

        return polling
      })
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
    setPredictedImage(state, predictedImage = {}) {
      if (!predictedImage?.id) {
        return
      }

      state.currentPredictedImageList = Object.assign({}, state.currentPredictedImageList, {
        [predictedImage.id]: predictedImage
      })
    },
    clear(state) {
      state.currentProject = {}
      state.currentImages = {}
      state.currentImageBundle = {}
      state.currentPredictedImage = {}
      state.currentPredictedImageList = {}
    },
    clearImagesFromProject(state) {
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
    setCurrentImageBundle(state, currentImageBundle = {}) {
      if (!currentImageBundle?.id) {
        return
      }

      state.currentImageBundle = Object.assign({}, currentImageBundle)
    },

    setCurrentPredictedImage(state, currentPredictedImage = {}) {
      if (!currentPredictedImage?.id) {
        return
      }

      state.currentPredictedImage = Object.assign({}, currentPredictedImage)
    },
    setCurrentPredictedImageFromList(state, id) {
      if (!id) {
        return
      }

      state.currentPredictedImage = Object.assign({}, state.currentPredictedImageList[id])
    },
    clearPredictedImages(state) {
      state.currentPredictedImageList = {}
    },
    clearCurrentPredictedImage(state) {
      state.currentPredictedImage = {}
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
