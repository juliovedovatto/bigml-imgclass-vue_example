import Cookies from 'js-cookie'
import { DateTime } from 'luxon'
import { SECURE_COOKIE } from '@/core/config'
import Storage from './main'
import isJSON from 'is-json'

export default class CookieStorage extends Storage {
  async get(key) {
    const k = this.key(key)
    const value = Cookies.get(k)

    return value !== undefined ? (isJSON(value) ? Cookies.getJSON(k) : value) : null
  }

  async set(key, value, expires = null) {
    const options = {
      secure: SECURE_COOKIE,
      sameSite: 'strict'
    }

    if (expires) {
      options.expires = DateTime.local()
        .plus({ seconds: expires })
        .toJSDate()
    }

    Cookies.set(this.key(key), value, options)
  }

  async delete(key) {
    if (!key) {
      return
    }

    Cookies.remove(this.key(key))
  }
}
