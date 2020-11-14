const before = require.context('./before/', false, /.+\.js$/i)
const resolve = require.context('./resolve/', false, /.+\.js$/i)
const after = require.context('./after/', false, /.+\.js$/i)

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
