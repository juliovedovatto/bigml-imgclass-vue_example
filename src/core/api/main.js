import { API_HOST } from '@/core/config'
import axios from 'axios'
import interceptors from './interceptors'
import { objToParams } from '@/core/helpers/url'

export default class API {
  constructor() {
    this.request = axios.create({
      baseURL: API_HOST,
      paramsSerializer: params => objToParams(params)
    })

    interceptors?.request?.forEach(i => this.request.interceptors.request.use(...i))
    interceptors?.response?.forEach(i => this.request.interceptors.response.use(...i))
  }
}
