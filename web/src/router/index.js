import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Layout',
    component: () => import(/* webpackChunkName: "layout" */ '../views/common/layout'),
    children: [
      {
        path: 'home-common',
        component: import('../views/home-common/home-common'),
        name: '主页',
        meta: {
          keepAlive: true,
          isEdit: true
        }
      }
    ]
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Home')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
