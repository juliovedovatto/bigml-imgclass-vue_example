import requireContext from 'require-context.macro'

const request = requireContext('./request/', false, /.+\.js$/i)
const response = requireContext('./response/', false, /.+\.js$/i)

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
