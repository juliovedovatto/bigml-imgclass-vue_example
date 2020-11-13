import API from './main'

class Auth extends API {
  constructor() {
    super()
  }

  async token(username, password) {
    const { data = null } = await this.request.post('/api/token/', { username, password })

    return data
  }

  async refreshTokens(refresh) {
    const { data = null } = await this.request.post('/api/token/refresh/', { refresh })

    return data
  }
}

export default new Auth()
