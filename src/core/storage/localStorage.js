import localforage from 'localforage'

export default class localStorage extends Storage {
  constructor() {
    super()

    localforage.config({ driver: localforage.LOCALSTORAGE })
  }

  async get(key) {
    const value = (await localforage.get(this.key(key))) || null

    return value
  }

  async set(key, value) {
    await localforage.set(this.key(key), value)
  }

  async delete(key) {
    if (!key) {
      return
    }

    await localforage.removeItem(this.key(key))
  }
}
