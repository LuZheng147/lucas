import Vue from 'vue'
import { Button, Message } from 'element-ui'
import {Form,FormItem}from 'element-ui'
import {Input}from 'element-ui'
import {Container,Main,Aside,Header,Menu,Submenu,MenuItemGroup,MenuItem} from 'element-ui'
// import {Message} from 'element-ui'
// import { from } from 'core-js/fn/array'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.prototype.$message = Message
