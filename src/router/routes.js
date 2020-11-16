import Home from '@/views/Home.vue'

export default [
  {
    path: '/',
    name: 'home',
    meta: {
      // requiresAuth: true
    },
    component: Home
  },
  {
    path: '/auth',
    meta: {
      layout: 'empty'
    },
    component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Auth.vue'),
    children: [
      {
        path: '',
        name: 'auth',
        redirect: { name: 'auth.login' }
      },
      {
        path: 'login',
        name: 'auth.login',
        component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Login.vue')
      },
      {
        path: 'logout',
        name: 'auth.logout',
        component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Logout.vue')
      }
    ]
  }
]
