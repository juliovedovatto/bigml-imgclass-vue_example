import { deleteFromCookieStore, retrieveFromCookieStore } from '@/core/helpers/storage'
import { AUTH_COOKIES } from '@/core/config'

/**
 * Check if there is an active access token in storage.
 * @returns {boolean}
 */
export async function checkAuthentication() {
  const authToken = await retrieveFromCookieStore(AUTH_COOKIES.ACCESS_TOKEN)
  const expiresAt = Number(await retrieveFromCookieStore(AUTH_COOKIES.EXPIRES_AT))

  return Boolean(authToken) && expiresAt > Date.now()
}

/**
 * reset (clear) Authentication Tokens
 */
export function resetAuth() {
  Object.values(AUTH_COOKIES).forEach(k => deleteFromCookieStore(k))
}

/**
 * Signout Users and clear state
 */
export function signOut() {
  // TODO: clear Vuex state
  resetAuth()
}
