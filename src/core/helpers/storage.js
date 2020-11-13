import { APP_ID } from '@/core/config'
import CookieStorage from '@/core/storage/cookies'
import { kebab } from 'case'

export const StoreType = {
  COOKIE: 'COOKIE'
}

/**
 * Set item to Cookie Storage
 * @param {string} key
 * @param value
 * @param {number} [expires] - Time in seconds to expire cookie. No value provided, cookie will a session cookie.
 */
export function addToCookieStore(key, value, expires = null) {
  addToStore(key, value, StoreType.COOKIE, expires)
}

/**
 * Set item to Storage. If item exists, it will overwrite it.
 * @param {string} key
 * @param value
 * @param {string} type (from StoreType const). Defaults to Cookie.
 * @param {number} [expires] - Time in seconds to expire cookie. No value provided, cookie will a session cookie.
 */
export function addToStore(key, value, type = StoreType.COOKIE, expires = null) {
  ;(async () => await getStore(type).set(key, value, expires))()
}

/**
 * Delete a item from Cookie Storage.
 * @param {string} key
 */
export function deleteFromCookieStore(key) {
  deleteFromStore(key, StoreType.COOKIE)
}

/**
 * Delete a item from Storage
 * @param {string} key
 * @param {string} type (from StoreType const). Defaults to Cookie.
 */
export function deleteFromStore(key, type = StoreType.COOKIE) {
  ;(async () => await getStore(type).delete(key))()
}

export const prefix = kebab(APP_ID)

/**
 * Retrive a item from Cookie Storage
 * @param {string} key
 */
export async function retrieveFromCookieStore(key) {
  return await retrieveFromStore(key, StoreType.COOKIE)
}

/**
 * Retrive a item from Storage
 * @param {string} key
 * @param {string} type (from StoreType const). Defaults to Cookie.
 */
export async function retrieveFromStore(key, type = StoreType.COOKIE) {
  return getStore(type).get(key)
}

/**
 *
 * @param {string} type (from StoreType const)
 * @throws Will throw an error if the type is invalid
 */
function getStore(type) {
  let instance

  switch (type) {
    case StoreType.COOKIE:
      instance = new CookieStorage()
      break
    default:
      throw new Error('Error while retrieving Store type')
  }

  return instance
}
