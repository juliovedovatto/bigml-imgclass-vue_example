const AUTH_COOKIES = {
  ACCESS_TOKEN: 'accessToken',
  EXPIRES_AT: 'expiresAt',
  REFRESH_TOKEN: 'refreshToken'
}

const UNAUTHORIZED_WHITELIST = ['/api/token/', '/api/token/verify/']

const REFRESH_TOKENS_INTERVAL = 60 * 30 // time in seconds

export { AUTH_COOKIES, REFRESH_TOKENS_INTERVAL, UNAUTHORIZED_WHITELIST }
