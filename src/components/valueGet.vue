<template>
  <div id="value_get">
    <div class="ceil">
      <img src="../../static/imgs/valueGet/title.png" alt="">
    </div>
		<div class="content">
			<img src="../../static/imgs/valueGet/bg.png" alt="">
			<div class="list_box">
				<div class="list" @click='buyMana()'>
					<img src="../../static/imgs/valueGet/bg_get.png" alt="">
					<div class="words">灵力：500</div>
					<div class="btn_get" v-if='!isBuy'><img src="../../static/imgs/valueGet/get.png" alt=""></div>
					<div class="info" v-else>请明日继续领取</div>
				</div>
				
			</div>
			<div class="waiting">敬请期待</div>
		</div>
    <!-- <div class="lists">
      <a class="list" @click='buyMana(90)'>
       <img src="../../static/imgs/valueGet/less.png" alt="">
      </a>
      <a class="list" @click='buyMana(500)'>
        <img src="../../static/imgs/valueGet/more.png" alt="">
      </a>
    </div> -->
  </div>
</template>
<script>
	import store from '../utils/store.js' ;
	import {ToastMe} from './toastSelf.js'

  export default {
    data(){
      return{
      }
    },
		props:['isBuy'],
    methods:{
      closePop(){
        this.$emit('closeValue')
      },
			buyMana(){//
				this.$axios.post('/api/mana/addMana').then(res=>{
					if(res&&res.status===200){
						if(res.data.code===200){
							store.setStore('mana',res.data.mana)
							ToastMe('获得500灵力')
							this.$emit('recharged',1)
						}else{
							ToastMe(res.data.err)
						}
					}
				})
			}
    }
  }
</script>
<style lang="less">
  #value_get{
		width:86%;
		margin:0 auto;
		color:#2f4d84;
    .ceil{
      position: relative;
      margin-bottom:18px;
    }
		.content{
			position: relative;
			.list_box{
				position:absolute;
				top:8%;
				left:7%;
				width:86%;
				.list{
					position: relative;
					.words{
						font-size:24px;
						position: absolute;
						top:8%;
						left:50%;
						transform: translateX(-50%);
					}
					.btn_get{
						position:absolute;
						bottom:10%;
						width:26%;
						left:37%;
					}
					.info{
						position: absolute;
						bottom:20%;
						font-size: 16px;
						width:100%;
						text-align: center;
						text-decoration: underline;
					}
				}
			}
			.waiting{
				position: absolute;
				bottom:15%;
				font-size: 16px;
				width:100%;
				text-align: center;
				text-decoration: underline;
			}
		}
    .lists{
			position: absolute;
			top:17%;
			left:0;
			width:100%;
      display: flex;
			box-sizing: border-box;
      padding: 15px 10vw 27px;
      justify-content:space-between;
      .list {
        width:40%;
        
      }
    }
  }
</style>
