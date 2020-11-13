import { deleteFromCookieStore, retrieveFromCookieStore } from '@/core/helpers/storage'

/**
 * Check if there is an active access token in storage.
 * @returns {boolean}
 */
export async function checkAuthentication() {
  const authToken = await retrieveFromCookieStore('accessToken')

  return Boolean(authToken)
}

/**
 * reset (clear) Authentication Tokens
 */
export function resetAuth() {
  ;['accessToken', 'expiresAt', 'refreshToken'].forEach(k => deleteFromCookieStore(k))
}

/**
 * Signout Users and clear state
 */
export function signOut() {
  // TODO: clear Vuex state
  resetAuth()
}
