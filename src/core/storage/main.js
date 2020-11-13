import { APP_ID } from '@/core/config'
import { kebab } from 'case'

export default class Storage {
  static get prefix() {
    return kebab(APP_ID)
  }

  // abstrsct methods
  async get() {
    throw new TypeError('Do not call abstract method get from child.')
  }
  async set() {
    throw new TypeError('Do not call abstract method set from child.')
  }
  async delete() {
    throw new TypeError('Do not call abstract method delete from child.')
  }

  // common methods
  key(key) {
    return `${this.prefix ? `${this.prefix}.` : ''}${key}`
  }
}
