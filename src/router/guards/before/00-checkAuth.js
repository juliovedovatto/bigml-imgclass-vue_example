import { checkAuthentication, signOut } from '@/core/helpers/auth'

/**
 * Navigation guard to verify user authentication.
 * @param {Object} to
 * @param {Object} _from
 * @param {Function} next
 * @returns {Function} Next route
 */
export default async function checkAuth(to, _from, next) {
  const requiresAuth = to.matched.some(m => m.meta.requiresAuth)
  const isAuthenticated = await checkAuthentication()

  // check if page requires authentication or check if user is already authenticated (has a token)
  if (!requiresAuth || isAuthenticated) {
    return next()
  }

  // if user is not authenticated and route requires auth, force clear User store
  // and redirect to login page
  signOut()
  const query = {}
  if (to.fullPath && to.fullPath !== '/') {
    query.next = to.fullPath
  }

  return next({ name: 'auth', query })
}
