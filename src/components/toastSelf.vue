<template>
  <div class="toast"  id='toastMe'>
  	<img src="../../static/imgs/public/toast_bg.png" alt="">
  	<div class="words">{{wordsToast}}</div>
  </div>
</template>
<script>
  export default {
    data(){
      return{
				wordsToast:'无提示'
      }
    },
    methods:{
      
    }
  }
</script>
<style lang="less">
  .toast{
  	position:fixed;
  	top:50%;
  	width:76%;
  	z-index:10000;
  	left:12%;
  	transform: translateY(-50%);
		img{width:100%;display: block;}
  	.words{
  		position:absolute;
  		top:50%;
  		left:12%;
  		width:76%;
  		text-align: center;
  		color:#485d70;
  		font-size: 16px;
  		transform: translateY(-50%);
  	}
  }
</style>
