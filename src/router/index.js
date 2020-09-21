import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'

Vue.use(VueRouter)

const   routes = [
  {
    path: '/login',
    component: login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path:'/home',
    component:home
  }
]

const router = new VueRouter({
  routes
})

export default router