import { objToParams, paramsToObj } from '@/core/helpers/url'

describe('@/core/helpers/url', () => {
  describe('@/core/helpers/url/objToParams', () => {
    test(`should return 'foo=bar from object`, () => {
      expect(objToParams({ foo: 'bar' })).toEqual('foo=bar')
    })
  })
  describe('@/core/helpers/url/paramsToObj', () => {
    test(`should return { foo: 'bar' } from query string`, () => {
      expect(paramsToObj('foo=bar')).toEqual({ foo: 'bar' })
    })
  })
})
