import { APP_ID, STORE_TYPE } from '@/core/config'
import { CookieStorage, LocalStorage } from '@/core/storage'
import { kebab } from 'case'

/**
 * Set item to Cookie Storage
 * @param {string} key
 * @param {*} value
 * @param {number} [expires] - Time in seconds to expire cookie. No value provided, cookie will a session cookie.
 */
export function addToCookieStore(key, value, expires = null) {
  addToStore(key, value, STORE_TYPE.COOKIE, expires)
}

/**
 * Set item to Storage. If item exists, it will overwrite it.
 * @param {string} key
 * @param {*} value
 * @param {string} type (from STORE_TYPE const). Defaults to Cookie.
 * @param {number} [expires] - Time in seconds to expire cookie. No value provided, cookie will a session cookie.
 */
export function addToStore(key, value, type = STORE_TYPE.COOKIE, expires = null) {
  ;(async () => await getStore(type).set(key, value, expires))()
}

/**
 * Delete a item from Cookie Storage.
 * @param {string} key
 */
export function deleteFromCookieStore(key) {
  deleteFromStore(key, STORE_TYPE.COOKIE)
}

/**
 * Delete a item from Storage
 * @param {string} key
 * @param {string} type (from STORE_TYPE const). Defaults to Cookie.
 */
export function deleteFromStore(key, type = STORE_TYPE.COOKIE) {
  ;(async () => await getStore(type).delete(key))()
}

export const prefix = kebab(APP_ID)

/**
 * Retrive a item from Cookie Storage
 * @param {string} key
 */
export async function retrieveFromCookieStore(key) {
  return await retrieveFromStore(key, STORE_TYPE.COOKIE)
}

/**
 * Retrive a item from Storage
 * @param {string} key
 * @param {string} type (from STORE_TYPE const). Defaults to Cookie.
 */
export async function retrieveFromStore(key, type = STORE_TYPE.COOKIE) {
  return getStore(type).get(key)
}

/**
 *
 * @param {string} type (from STORE_TYPE const)
 * @throws Will throw an error if the type is invalid
 */
function getStore(type) {
  let instance

  switch (type) {
    case STORE_TYPE.COOKIE:
      instance = new CookieStorage()
      break
    case STORE_TYPE.LOCALSTORAGE:
      instance = new LocalStorage()
      break
    default:
      throw new Error('Error while retrieving Store type')
  }

  return instance
}
