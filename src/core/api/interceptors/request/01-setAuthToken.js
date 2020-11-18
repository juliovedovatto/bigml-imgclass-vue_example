import { AUTH_COOKIES } from '@/core/config'
import { retrieveFromCookieStore } from '@/core/helpers/storage'

export default [
  async config => {
    const token = await retrieveFromCookieStore(AUTH_COOKIES.ACCESS_TOKEN)

    config.headers.Authorization = (token && `Bearer ${token}`) || ''

    return config
  }
]
