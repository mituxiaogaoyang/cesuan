import axios from  'axios';
import {Toast} from  'vant';
import router from '../router'
//来源： https://juejin.im/post/59a22e71518825242c422604  自己微调
const Axios = axios.create({
  baseURL: "/", // 因为我本地做了反向代理
  timeout: 10000,
//   responseType: "json",
//   withCredentials: true, // 是否允许带cookie这些
//   headers: {
//     "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
//   }
});
const Axios2 = axios.create({
  baseURL: "/", // 因为我本地做了反向代理
  timeout: 10000
});
Axios.interceptors.request.use(
  config => {
    // 若是有做鉴权token , 就给头部带上token
    // 若是需要跨站点,存放到 cookie 会好一点,限制也没那么多,有些浏览环境限制了 localstorage 的使用
    // 这里localStorage一般是请求成功后我们自行写入到本地的,因为你放在vuex刷新就没了
    // 一些必要的数据写入本地,优先从本地读取
    if (localStorage.token||window.tokenTemp) {
      config.headers.Authorization = localStorage.token||window.tokenTemp;
    }
    return config;
  },
  error => {
		console.log(error)
    return Promise.reject(error.data);
  }
);
//返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
    //对响应数据做些事
    if (res.data&&res.data.code===101) {
			router.push({name:'index'})
       // Toast('token已失效，请刷新页面或重新登录')
//       return Promise.reject(res.data.msg);
    }
    return res;
  },
  error => {
		// 下面是接口回调的satus ,因为我做了一些错误页面,所以都会指向对应的报错页面
		console.log(233+error)
		// 下面是接口回调的satus ,因为我做了一些错误页面,所以都会指向对应的报错页面
		
    // 返回 response 里的错误信息
    return Promise.reject(error);
  }
);

export {Axios,Axios2} ;

