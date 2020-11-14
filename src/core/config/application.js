const {
  NODE_ENV = 'development',
  VUE_APP_API_HOST = '',
  VUE_APP_SENTRY_DSN = '',
  VUE_APP_SECURE_COOKIE = false,
  VUE_APP_APPLICATION_ID = null,
  VUE_APP_BASE_URL = '/'
} = process.env

const { version } = require('../../../package.json')

const ENVIRONMENT = NODE_ENV
const BASE_URL = VUE_APP_BASE_URL || '/'
const API_HOST = `http://${VUE_APP_API_HOST || 'localhost:8001'}`
const SENTRY_DSN = VUE_APP_SENTRY_DSN
const APP_VERSION = version || '0.0.0'
const SECURE_COOKIE = (VUE_APP_SECURE_COOKIE && ['1', 'true'].includes(String(VUE_APP_SECURE_COOKIE))) || false
const APP_ID = VUE_APP_APPLICATION_ID || null

export { API_HOST, APP_ID, APP_VERSION, BASE_URL, ENVIRONMENT, SECURE_COOKIE, SENTRY_DSN }
