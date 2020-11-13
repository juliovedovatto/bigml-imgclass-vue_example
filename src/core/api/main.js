import { API_HOST } from '@/core/config'
import axios from 'axios'
import { objToParams } from '@/core/helpers/url'
import { retrieveFromCookieStore } from '@/core/helpers/storage'

export default class API {
  constructor() {
    this.request = axios.create({
      baseURL: API_HOST,
      paramsSerializer: params => objToParams(params)
    })

    this.request.interceptors.request.use(async config => {
      const token = await retrieveFromCookieStore('accessToken')

      config.headers.Authorization = (token && `Bearer ${token}`) || ''

      return config
    })
  }
}
