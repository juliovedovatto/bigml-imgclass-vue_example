import { deleteFromCookieStore, retrieveFromCookieStore } from '@/core/helpers/storage'

const RESET_TOKENS = ['accessToken', 'expiresAt', 'refreshToken']

/**
 * Check if there is an active access token in storage.
 * @returns {boolean}
 */
export async function checkAuthentication() {
  const authToken = await retrieveFromCookieStore('accessToken')
  const expiresAt = Number(await retrieveFromCookieStore('expiresAt'))

  return Boolean(authToken) && expiresAt > Date.now()
}

/**
 * reset (clear) Authentication Tokens
 */
export function resetAuth() {
  RESET_TOKENS.forEach(k => deleteFromCookieStore(k))
}

/**
 * Signout Users and clear state
 */
export function signOut() {
  // TODO: clear Vuex state
  resetAuth()
}
