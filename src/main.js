import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
Vue.use(ElementUI);
//配置请求根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/';
// 设置axios拦截器添加token验证
axios.interceptors.request.use( config =>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
