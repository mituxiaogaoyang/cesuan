<template>
  <div id="app">
    <router-view/>
		<audio src="../../static/audio/SFX_Battle_Touchon.ogg" id='audio'></audio>
  </div>
	
</template>

<script>
export default {
  name: 'App',
	mounted(){
		//点击音效
		let audio = document.querySelector('#audio')
		// jquery  live实现
		function live(target, type, fn){    //元素类型，事件类型，执行函数
				document.onclick = function(event){
						var e = event ? event : window.event;
						
						if(e.type == type && (e.target.tagName.toLocaleLowerCase() == target||e.target.parentNode.tagName.toLocaleLowerCase() == target)){
								fn();    //如果元素类型和事件类型同时匹配,则执行函数
						}
				}
		}
		live("a", "click", function(){
				audio.play();
		});
	}
}
</script>

<style lang='less'>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #04396a;
	font-size: 14px;
}
.red{
	color:#c52a2b;
}
.blue{
	color:#009fff;
}
.van-modal{
	background-color: rgba(255,255,255,.6)!important
}
.van-popup{background: transparent!important}
</style>
