const request = require.context('./request/', false, /.+\.js$/i)
const response = require.context('./response/', false, /.+\.js$/i)

const interceptors = {
  request: request
    .keys()
    .sort()
    .map(k => request(k).default),
  response: response
    .keys()
    .sort()
    .map(k => response(k).default)
}

export default interceptors
