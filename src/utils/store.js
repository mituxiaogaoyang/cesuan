// 对localStorage的封装，方便后面直接调用
export default {
  //增改
  setStore:(k,v)=>{
    if(!k) return;
    if(typeof v !== 'string'){
      v = JSON.stringify(v)
    }
    if(localStorage){
      localStorage.setItem(k,v)
    }else{
      console.log('浏览器不支持本地存储，请更新浏览器')
    }
  },
	//临时存储 下次进入页面不在了
	setStoreTemp:(k,v)=>{
    if(!k) return;
    if(typeof v !== 'string'){
      v = JSON.stringify(v)
    }
    if(sessionStorage){
      sessionStorage.setItem(k,v)
    }else{
      console.log('浏览器不支持sessionStorage，请更新浏览器')
    }
  },
	
  //查询
  getStore: k=>{
    if(!k) return;
    if(typeof k !== 'string' ){
      return JSON.parse(localStorage.getItem(k))
    }else{
      return localStorage.getItem(k)
    }

  },
	getStoreTemp: k=>{
	    if(!k) return;
	    if(typeof k !== 'string' ){
	      return JSON.parse(sessionStorage.getItem(k))
	    }else{
	      return sessionStorage.getItem(k)
	    }
	
	  },
  //删除
  deleteStore:k=>{
    if(!k) return;
    localStorage.removeItem(k)
  }
}
