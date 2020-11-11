const { NODE_ENV = 'development', VUE_APP_API_HOST = '', VUE_APP_SENTRY_DSN = '' } = process.env

const ENVIRONMENT = NODE_ENV
const API_HOST = VUE_APP_API_HOST || 'http://localhost:8000'
const SENTRY_DSN = VUE_APP_SENTRY_DSN

export default {
  ENVIRONMENT,
  API_HOST,
  SENTRY_DSN
}
