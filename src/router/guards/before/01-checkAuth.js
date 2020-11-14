import { checkAuthentication } from '@/core/helpers/auth'
import store from '@/store'

/**
 * Navigation guard to verify user authentication.
 * @param {Object} to
 * @param {Object} from
 * @param {Function} next
 * @returns {Function} Next route
 */
export default async function checkAuth(to, from, next) {
  const requiresAuth = to.matched.some(m => m.meta.requiresAuth)
  const isAuthenticated = await checkAuthentication()

  store.dispatch('auth/requiresAuth', requiresAuth)

  // check if page requires authentication or check if user is already authenticated (has a token)
  if (!requiresAuth) {
    return next()
  }

  if (isAuthenticated) {
    store.dispatch('auth/toggleUserLoggedIn', true)
    return next()
  }

  // if user is not authenticated and route requires auth, force clear User store
  // and redirect to login page
  store.dispatch('auth/logout')
  const query = {}
  if (to.fullPath && to.fullPath !== '/') {
    query.next = to.fullPath
  }

  next({ name: 'auth', query })
}
