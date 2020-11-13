import { BASE_URL } from '@/core/config'
import Vue from 'vue'
import VueRouter from 'vue-router'
import guards from './guards'
import routes from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: BASE_URL,
  routes
})

guards.before && guards.before.forEach(g => router.beforeEach(g))
guards.resolve && guards.resolve.forEach(g => router.beforeResolve(g))
guards.after && guards.after.forEach(g => router.afterEach(g))

export default router
