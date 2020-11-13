import { existsSync, readFileSync } from 'fs'

/**
 * Taken from vue-cli core.
 * This method will check with the vue instance is running inside a container environement.
 * DO NOT use in regular Vue components, this is node level function.
 * @returns {boolean}
 */
export function checkInContainer() {
  if (existsSync('/proc/1/cgroup')) {
    const content = readFileSync('/proc/1/cgroup', 'utf-8')

    return /:\/(lxc|docker|kubepods)\//.test(content)
  }
}
