import requireContext from 'require-context.macro'

const before = requireContext('./before/', false, /.+\.js$/i)
const resolve = requireContext('./resolve/', false, /.+\.js$/i)
const after = requireContext('./after/', false, /.+\.js$/i)

const guards = {
  before: before
    .keys()
    .sort()
    .map(k => before(k).default),
  after: after
    .keys()
    .sort()
    .map(k => after(k).default),
  resolve: resolve
    .keys()
    .sort()
    .map(k => resolve(k).default)
}

export default guards
