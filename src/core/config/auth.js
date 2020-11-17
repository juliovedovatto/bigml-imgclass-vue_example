const { VUE_APP_TEST_API_USER, VUE_APP_TEST_API_KEY } = process.env

const AUTH_COOKIES = {
  ACCESS_TOKEN: 'accessToken',
  EXPIRES_AT: 'expiresAt',
  REFRESH_TOKEN: 'refreshToken'
}

const UNAUTHORIZED_WHITELIST = ['/api/token/', '/api/token/verify/']

const REFRESH_TOKENS_INTERVAL = 60 * 30 // time in seconds

const TEST_API_USER = VUE_APP_TEST_API_USER || ''
const TEST_API_KEY = VUE_APP_TEST_API_KEY || ''

export { AUTH_COOKIES, REFRESH_TOKENS_INTERVAL, TEST_API_KEY, TEST_API_USER, UNAUTHORIZED_WHITELIST }
