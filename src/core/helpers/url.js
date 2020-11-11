/** @module core/helpers/url */

import qs from 'qs'

/**
 * Convert object to a query string.
 * Example: { foo: 'bar' } => 'foo=bar'
 * @param {Object} obj
 * @return {string} The query string representation of the object
 */
export function objToParams(obj) {
  return qs.stringify(obj)
}

/**
 * Convert a query string to object.
 * Example: 'foo=bar' => { foo: 'bar' }
 * @param {string} params
 * @return {Object} the object representation of the query string
 */
export function paramsToObj(params) {
  return qs.parse(params)
}
