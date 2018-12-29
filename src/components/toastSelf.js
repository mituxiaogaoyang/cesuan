import Vue from  'vue';
import toastSelf from './toastSelf.vue' ;
export function ToastMe(word){
	let ins =new (Vue.extend(toastSelf))({
      el: document.createElement('div')
    });
	Object.assign(ins, {wordsToast:word});
	document.body.appendChild(ins.$el)
	setTimeout(()=>{document.body.removeChild(ins.$el)},2000)
}
