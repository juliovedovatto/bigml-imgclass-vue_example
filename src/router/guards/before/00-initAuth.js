import store from '@/store'

/**
 * Navigation guard to init auth state.
 * @param {Object} to
 * @param {Object} from
 * @param {Function} next
 * @returns {Function} Next route
 */
export default async function initAuth(to, from, next) {
  await store.dispatch('auth/init')
  next()
}
