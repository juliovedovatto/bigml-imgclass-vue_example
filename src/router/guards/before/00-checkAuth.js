import { checkAuthentication } from '@/core/helpers/auth'
import store from '@/store'
import { t } from '@/core/helpers/i18n'

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

  await store.dispatch('auth/init')

  // check if page requires authentication or check if user is already authenticated (has a token)
  if (!requiresAuth) {
    return next()
  }

  try {
    if (isAuthenticated) {
      await store.dispatch('auth/verify')
      store.dispatch('auth/toggleUserLoggedIn', true)
      return next()
    }
  } catch (err) {
    const { status = null } = err?.response || {}

    // TODO: show error alert
    const error = t(status === 401 ? 'common.error.auth.validate-error' : 'common.error.general')
    console.error(error)
  }

  // if user is not authenticated and route requires auth, force clear User store
  // and redirect to login page
  store.dispatch('auth/logout')
  const query = {}
  if (to.fullPath && to.fullPath !== '/') {
    query.next = to.fullPath
  }

  // little trick to avoid error case redirected back to login after trying to login
  if (from.name !== 'auth.login') {
    next({ name: 'auth', query })
  }
}
