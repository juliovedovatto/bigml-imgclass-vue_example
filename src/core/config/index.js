const {
  NODE_ENV = 'development',
  VUE_APP_API_HOST = '',
  VUE_APP_SENTRY_DSN = '',
  VUE_APP_SECURE_COOKIE = false,
  VUE_APP_APPLICATION_ID = null
} = process.env

const { version } = require('../../../package.json')

const ENVIRONMENT = NODE_ENV
const API_HOST = `http://${VUE_APP_API_HOST || 'localhost:8001'}`
const SENTRY_DSN = VUE_APP_SENTRY_DSN
const APP_VERSION = version || '0.0.0'
const SECURE_COOKIE = (VUE_APP_SECURE_COOKIE && ['1', 'true'].includes(String(VUE_APP_SECURE_COOKIE))) || false
const APP_ID = VUE_APP_APPLICATION_ID || null
const REFRESH_TOKENS_INTERVAL = 60 * 30 // time in seconds

export { API_HOST, APP_ID, APP_VERSION, ENVIRONMENT, REFRESH_TOKENS_INTERVAL, SECURE_COOKIE, SENTRY_DSN }
