import API from './main'
// import { objectToFormData } from '@/core/helpers/form'

class Project extends API {
  constructor() {
    super()
  }

  async list() {
    return await this.request.get('/projects/')
  }

  async get(id) {
    return await this.request.get(`/projects/${id}/`)
  }

  async create(data = {}) {
    return await this.request.post('/projects/', data)
  }

  async update(id, data = {}) {
    return await this.request.post(`/projects/${id}/`, data)
  }

  async delete(id) {
    return await this.request.delete(`/projects/${id}/`)
  }

  check(id, callback) {
    this.poll(`/projects/${id}/`, callback)
  }

  async listImages(id) {
    return await this.request.get(`/projects/${id}/images/`, { params: { limit: 1000 } })
  }

  async listImageBundle(id) {
    return await this.request.get(`/projects/${id}/image-bundles/`)
  }

  async listImageBundleImages(projectId, id) {
    return await this.request.get(`/projects/${projectId}/image-bundles/${id}/images/`)
  }

  async getImageBundle(projectId, id) {
    return await this.request.get(`/projects/${projectId}/image-bundles/${id}/`)
  }

  async createImageBundle(id, data = {}) {
    const formData = new FormData()
    formData.append('id', id)
    formData.append('file', data)
    return await this.request.post(`/projects/${id}/image-bundles/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  async checkImageBundle(projectId, id, callback) {
    this.poll(`/projects/${projectId}/image-bundles/${id}/`, callback)
  }

  async predictImage(id, data = {}) {
    const formData = new FormData()
    formData.append('id', id)
    formData.append('file', data)
    return await this.request.post(`/projects/${id}/predict-image/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  async getPredictedImage(projectId, id) {
    return await this.request.get(`/projects/${projectId}/predict-image/${id}/`)
  }

  async listPredictedImages(projectId) {
    return await this.request.get(`/projects/${projectId}/predict-image/`)
  }

  async deleteImageBundle(projectId, id) {
    return await this.request.delete(`/projects/${projectId}/images-bundle/${id}/`)
  }
}

export default new Project()
