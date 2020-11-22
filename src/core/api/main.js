import { API_HOST } from '@/core/config'
import axios from 'axios'
import axiosRequestHandler from 'axios-request-handler'
import interceptors from './interceptors'
import { objToParams } from '@/core/helpers/url'

export const POLLLING_TYPES = {
  GET: 'get',
  POST: 'post'
}

export default class API {
  constructor() {
    this.request = axios.create({
      baseURL: API_HOST,
      paramsSerializer: params => objToParams(params)
    })

    interceptors?.request?.forEach(i => this.request.interceptors.request.use(...i))
    interceptors?.response?.forEach(i => this.request.interceptors.response.use(...i))
  }

  poll(url, callback, params = {}, time = 3000, type = POLLLING_TYPES.GET) {
    const instance = new axiosRequestHandler(url, { axiosInstance: this.request })
    const requestType = (Object.values(POLLLING_TYPES).includes(type) && type) || POLLLING_TYPES.GET

    instance.poll(time)[requestType](callback, { params })
  }
}
