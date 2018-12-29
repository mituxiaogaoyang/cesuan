import Vue from 'vue'
import Router from 'vue-router'
import index from  '@/pages/index'
import sign from  '@/pages/sign'
import portrait from  '@/pages/portrait'
import tips from  '@/pages/tips'
import setting from  '@/pages/setting'
import weekCard from  '@/pages/weekCard'
import relation from  '@/pages/relationship'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
		{
			path: '/index',
			redirect:{name:'index'}
		},
		{
			path: '/tips',
			name: 'tips',
			component: tips
		},
		{
			path: '/sign',
			name: 'sign',
			component: sign
		},
		{
			path: '/portrait',
			name: 'portrait',
			component: portrait
		},
		{
			path: '/setting',
			name: 'setting',
			component: setting
		},
		{
			path: '/weekCard',
			name: 'weekCard',
			component: weekCard
		},
		,
		{
			path: '/relationship',
			name: 'relationship',
			component: relation
		}
  ]
})
