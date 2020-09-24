import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'
import welcome from '@/components/welcome'
import users from '@/components/user/users'

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
    component:home,
    redirect: '/welcome',
    children:[
      {
        path:"/welcome",
        component:welcome
      },
      {
        path:'/users',
        component:users
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
