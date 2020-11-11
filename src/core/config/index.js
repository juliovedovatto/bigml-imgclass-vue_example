const { NODE_ENV = 'development', VUE_APP_API_HOST = '', VUE_APP_SENTRY_DSN = '' } = process.env

const { version } = require('../../../package.json')

const ENVIRONMENT = NODE_ENV
const API_HOST = `http://${VUE_APP_API_HOST || 'localhost:8000'}`
const SENTRY_DSN = VUE_APP_SENTRY_DSN
const APP_VERSION = version || '0.0.0'

export { APP_VERSION, ENVIRONMENT, API_HOST, SENTRY_DSN }
