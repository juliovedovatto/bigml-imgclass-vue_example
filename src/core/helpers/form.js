import { serialize } from 'object-to-formdata'

/**
 * Convert an Object to FormData Object.
 * @param {Object} obj
 * @returns {FormData}
 */
export function objectToFormData(obj) {
  return serialize(obj)
}
