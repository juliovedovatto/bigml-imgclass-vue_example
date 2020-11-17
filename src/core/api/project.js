import API from './main'

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

  async listImages(id) {
    return await this.request.get(`/projects/${id}/images/`)
  }
}

export default new Project()
