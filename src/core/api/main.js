import { API_HOST } from '@/core/config'
import axios from 'axios'
import { objToParams } from '@/helpers/url'

class API {
  constructor() {
    this.request = axios.create({
      baseURL: API_HOST,
      paramsSerializer: params => objToParams(params)
    })

    this.request.interceptors.request.use(config => {
      const token = '' // TODO: retrieve token from auth store

      config.headers.Authorization = (token && `Bearer ${token}`) || ''

      return config
    })
  }
}

export default new API()
