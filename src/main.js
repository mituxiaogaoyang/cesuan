// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant'
import store from './utils/store.js'
import {Axios,Axios2} from  './utils/axiosCenter'
import 'vant/lib/index.css';
import {ToastMe} from '@/components/toastSelf.js'
Vue.use(Vant)
Vue.prototype.$axios = Axios ;
Vue.config.productionTip = false

//导航守卫
router.beforeEach((to, from, next) => {
	if(to.name==='sign'){
		if(!store.getStore('token')){
			
			ToastMe('暂时没有权限，登陆后可请符')
			next(false)
		}else{
			next()
		}
	}else{
		next()
	}
	
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
