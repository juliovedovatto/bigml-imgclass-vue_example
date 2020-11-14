import store from '@/store'

/**
 * Navigation guard to verify user authentication.
 * @param {Object} to
 * @param {Object} from
 * @param {Function} next
 * @returns {Function} Next route
 */
export default async function vertifyAuth(to, _from, next) {
  if (!store.getters['auth/isAuthRequired'] || store.getters['auth/isAuthVerified']) {
    return next()
  }

  try {
    await store.dispatch('auth/verify')
  } catch (err) {
    const { status = null } = err?.response || {}

    // TODO: show error alert
    const error = this.$t(status === 401 ? 'common.error.auth.validate-error' : 'common.error.general')
    console.error(error)

    this.$router.push({ name: 'auth.logout' })
  }

  next()
}
