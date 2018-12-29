<template>
  <div id="portrait">
		<div class="top">
			<router-link :to="{name:'index'}" class="back"><img src="../../static/imgs/public/home.png" ></router-link>
			<div class="title"><img src="../../static/imgs/portrait/title.png" ></div>
		</div>
		<div class="avatar_box">
			<img src="../../static/imgs/portrait/avatar_box.png" alt="">
			<div class="tags">
				<div class="tag" v-for="word in desc" :style="{fontSize:32 - word.length*3+ Math.random()*2 + 'px'}">{{word}}</div>
			</div>
			<div class="avatar"  @click='personSelect'>
				<img :src="avatar?'../../static/imgs/avatars/cat'+avatar+'.png':'../../static/imgs/avatars/avatar.png'">
				<div class="name_box">
					<img src="../../static/imgs/portrait/name_box.png" alt="">
					<div class="name">{{name}}</div>
				</div>
			</div>
		</div>
		<div class="bot">
			<a class="btn_share"><img src="../../static/imgs/portrait/share.png" alt=""></a>
			<a @click='toRelation' class="to_relation"><img src="../../static/imgs/portrait/relation.png" alt=""></a>
		</div>
		
		<van-popup v-model="personSelected" class="form_pop birth_pop_outer">
			<div class="birth_pop">
				
				<div class="ceil">
					<a class="back" @click="personSelected=false"><img src="../../static/imgs/public/back.png" alt=""></a>
					<img src="../../static/imgs/birthLists/title.png">
				</div>
				<div class="births">
					<img src="../../static/imgs/birthLists/bg.png">
					<div class="lists">
						<a class="list" @click='birthSelect(person.birthday,person.birthtype,person.inuse,person.id,person.name,person.HeadPortrait)'  v-for="person in persons">
							<div class="icon">
								<img :src="'../../static/imgs/avatars/cat'+person.HeadPortrait+'.png'">
							</div>
							<img src="../../static/imgs/birthLists/selected.png" v-if="person.inuse">
							<img src="../../static/imgs/birthLists/noSelected.png" v-else>
							<div class="name">{{person.name}}</div>
							<div class="gender">{{person.sex?'女':'男'}}</div>
							<div class="type">{{person.birthtype?'农历':'公历'}} {{person.birthday}}</div>
						</a>
					</div>
				</div>
			</div>
		</van-popup>
  </div>
</template>

<script>
import store from  '@/utils/store'
import  birthForm from '@/components/birthAdd.vue'
import {ToastMe} from '../components/toastSelf.js'
import router from '@/router'

  export default {
    data() {
      return {
				personSelected:false, //选择生日
				birthAdd:false,
				datePicker:false,
				name:'未选择生日',
				avatar:store.getStore('avatar'),
        desc:[],
				persons:[ ],//生日管理列表
      };
    },
		components:{birthForm},
    mounted(){
		
			this.getBirthName();
			this.getSelfInfo();
			this.getListBirth()
      // 基于准备好的dom，初始化echarts实例
    },
    methods: {
			getSelfInfo(){
				if(store.getStore('token')){
					this.$axios.post('/api/oneself/getThis').then(res=>{
						if(res&&res.status===200){
							if(res.data.code===200){
								let arr = res.data.result.split(',');
								let arrTemp = arr.slice(0) ;
								
								for(let i=0,len = arr.length ;i<len;i++){
									if(arr[i].substr(0,1)==='*'){
										arr[i] = arr[i].substr(1)
										arrTemp.unshift(arr[i])
									}else{
										arrTemp.push(arr[i])
									}
								}
								for(let i=0,len = arrTemp.length ;i<len;i++){
									if(arrTemp[i].substr(0,1)==='*'){
										arrTemp[i] = arrTemp[i].substr(1)
									}
								}
								
								this.desc =arrTemp
							}else if(res.data.code===501){
								ToastMe(res.data.msg)
							}else{
								ToastMe(res.data.err)
							}
						}
					})
				}else{
					if(store.getStore('birthday')){ //存过生日
						this.$axios.post('/api/oneself/getThis',{birthtype:Number(store.getStore('birthtype')),birthday:store.getStore('birthday')}).then(res=>{
							if(res&&res.status===200){
								if(res.data.code===200){
									this.avatar = res.data.headPortrait
									let arr = res.data.result.split(',');
									let arrTemp = arr.slice(0) ;
									
									for(let i=0,len = arr.length ;i<len;i++){
										if(arr[i].substr(0,1)==='*'){
											arr[i] = arr[i].substr(1)
											arrTemp.unshift(arr[i])
										}else{
											arrTemp.push(arr[i])
										}
									}
									for(let i=0,len = arrTemp.length ;i<len;i++){
										if(arrTemp[i].substr(0,1)==='*'){
											arrTemp[i] = arrTemp[i].substr(1)
										}
									}
									
									this.desc =arrTemp
								}else if(res.data.code===501){
									ToastMe(res.data.msg)
								}else{
									ToastMe(res.data.err)
								}
							}
						})
					}else{
						router.push({name:'index'})
					}
				}
				
			},
			getBirthName(){ //获取当前选中的生日 姓名
				if(store.getStore('token')){
					this.$axios.post('/api/birthday/getUsingBirthDay').then(res=>{
						if(res&&res.status===200){
							if(res.data.code===200){
								let time = res.data.result.birthday ,type = res.data.result.birthtype ,ids =res.data.result.id;
								this.name = res.data.result?res.data.result.name:'未选择生日'
								this.avatar = res.data.result?res.data.result.headPortrait:null
								this.birthOn = {id:ids,time: time,type:type,name:this.name,avatar:this.avatar}
							}
						}
					})
				}else{
					this.name = store.getStore('birthNameTemp')
				}
			},
			getListBirth(){//获取生日列表 (一页10张)
				this.$axios.post('/api/birthday/getAllBirthDayByPage',{page:1,size:20}).then(res=>{
					if(res&&res.status===200){
						if(res.data.code===200){
							this.persons = res.data.list
							
							if(res.data.total>20){
								ToastMe('生日多于20条，只显示20条')
							}
						}
					}
				})
			},
			personSelect(){ //选择生日
				// this.getListBirth()
				this.personSelected = true
			},
			birthSelect(day,type,tag,id,name,avatar){ //选择生日
				if(!tag){
					this.$axios.post('/api/oneself/getThis',{birthday:day,birthtype:type}).then(res=>{
						if(res&&res.status===200){
							if(res.data.code===200){
								this.birthOn = {id:id,time: day,type:type,name:name,avatar:avatar}
								let arr = res.data.result.split(',');
								let arrTemp = arr.slice(0) ;
								
								for(let i=0,len = arr.length ;i<len;i++){
									if(arr[i].substr(0,1)==='*'){
										arr[i] = arr[i].substr(1)
										arrTemp.unshift(arr[i])
									}else{
										arrTemp.push(arr[i])
									}
								}
								for(let i=0,len = arrTemp.length ;i<len;i++){
									if(arrTemp[i].substr(0,1)==='*'){
										arrTemp[i] = arrTemp[i].substr(1)
									}
								}
								this.desc = arrTemp
								this.personSelected = false
								let listOld = this.persons ,t = this ;
								for(let i=0,len = listOld.length;i<len;i++){
									if(listOld[i].id === id){
										listOld[i].inuse = 1 ;
										t.name = listOld[i].name
										t.avatar = listOld[i].HeadPortrait
									}else{
										listOld[i].inuse = 0
									}
									
								}
								this.persons = listOld
							}
						}
					})
				}else{
					return false ;
				}
			},
			toRelation(){
				if(store.getStore('token')){ //正式账户
					this.birthOn.time = this.birthOn.time.split(' ')[0]
					this.$router.push({name:'relationship',query:this.birthOn})
				}else{
					ToastMe("登录后查看")
				}		
			}
    }
  };
</script>

<style lang="less">
	@bottomInit:300px ;
	@font-face{
	    font-family: 'font1';               /*自定义字体名称*/
	    src: url('../../static/font/font1.TTF') format('woff');         /*现代浏览器*/
		  src:  url('../../static/font/font1.TTF') format('truetype');     /*Safari,Android,iOS*/
	}
  #portrait{
		height:100vh;
		width:100%;
		overflow: hidden;
		background:#fff url(../../static/imgs/public/bg.png) center bottom fixed no-repeat;
		background-size:cover;
		position: relative;
    img{display: block;width:100%}
    min-height: 100vh;
    a{
      display: block;
      text-decoration: underline;
      &.alert{
        color:#fd917d
      }
    }
    a:active{transform: scale(1.06);}
		
		.avatar_box{
			position: absolute;
			top:52%;
			transform: translateY(-50%);
			width:100%;
			left:0;
			.avatar{
				position:absolute;
				width:33.8vw;
				left:33.1vw;
				top:33.4%;
				.name_box{
					bottom: -24%;
					position:absolute;
					text-align: center;
					left:2%;
					width:96%;
					.name{
						position: absolute;
						top:50%;
						left:5%;
						width:90%;
						transform: translateY(-50%);
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					
				}
			}
		}
		.tags{
 			position:absolute;
			left:2%;
			top:8%;
			bottom: 0;
			right:0;
			font-family: 'font1';
			.tag{
				position:absolute;
				bottom:@bottomInit;
				font-size: 22px;;
				line-height: 1.1;
				&:first-child{
					font-size: 36px !important;
					bottom: 58%;
					left:6vh;
					width:20px; 
					font-weight: bold;
				}
				&:nth-child(2){
					font-size: 32px !important;
					top: -20px;
					left:42vw;
					font-weight: bold;
				}
				&:nth-child(3){
					font-size: 32px !important;
					top: 75%;
					left:60vw;
					width:20px;
					font-weight: bold;
				}
				&:nth-child(4){
					bottom: 85%;
					left:26vw;
					width:20px;
				}
				&:nth-child(5){
					top: 8%;
					left:50vw;
				}
				&:nth-child(6){
					top: 19%;
					left:69vw;
				}
				&:nth-child(7){
					top: 29%;
					left:78vw;
					width:20px;
				}
				&:nth-child(8){
					top: 64%;
					left:70vw;
				}
				&:nth-child(9){
					top: 80%;
					left:76vw;
				}
				&:nth-child(10){
					top: 85%;
					left:44vw;
					width:20px;
				}
				&:nth-child(11){
					top: 89% ;
					right:61vw;
					
				}
				&:nth-child(12){
					top: 99% ;
					right:61vw;
					
				}
				&:nth-child(13){
					top: 72% ;
					left:6vw;
				}
				&:nth-child(14){
					top: 54% ;
					left:1vw;
				}
				&:nth-child(15){
					top:-9vh;
					left:36vw;
				}
				&:nth-child(16){
					top:-15vh;
					left:36vw;
				}
			}
		}
		
    .top{
      position: fixed;
      top:0;
      z-index:10;
      width:100%;
			height:10vh;
      left:0;
			background: url(../../static/imgs/public/header.png) no-repeat;
			background-size: cover;
      .back{
        position: absolute;
        height:5vh;
        left:3vw;
        top:2.5vh;;
				img{
					width:auto;
					height:100%;
				}
      }
      .title{
        width:75vw;
        margin:2.8vh auto;
      }
			
    }
		.bot{
			position: absolute;
			bottom:5vh;
			left:10vw;
			width:80vw;
			font-size: 18px;
			font-weight: bold;
			img{
				height: 100%;
				width:auto;
			}
			.btn_share{
				float:left;
				color:#327573;
				height:42px;
			}
			.to_relation{
				float:right;
				height:42px;
			}
		}
		
    .birth_pop_outer{
    	width:86%;
    	top:55%;
    }
		.birth_pop{
			.ceil{
				position: relative;
				.back{
					position: absolute;
					top:0;
					left:3vw;
					height:100%;
					img{
						width:auto;
						height:56%;
						transform: translateY(35%);
					}
				}
			}
			.births{
				position: relative;
				margin-top:4vh;
				z-index:7;
				.lists{
					position: absolute;
					top:0;
					left:0;
					right:0;
					bottom:0;
					overflow-y: scroll;
					.delete_birth{
						display: block;
						height:100%;
						img{
							width:auto;
							height:100%;
						}
					}
					.list{
						position: relative;
						margin:20px 4.5vw 0;
						font-size: 13px;
						.icon{
							position:absolute;
							top:8.1%;
							left:2.4%;
							width:14.8vw;
						}
						.name{
							position:absolute;
							top:22%;
							left:36%;
						}
						.gender{
							position:absolute;
							top:22%;
							right:12%;
						}
						.type{
							position:absolute;
							top:54%;
							left:36%;
						}
						
					}
				}
				.add{
					width:32vw;;
					margin:24px auto 45px;
				}
				.lists2{
					position: absolute;
					top:0;
					left:0;
					right:0;
					bottom:0;
					overflow-y: scroll;
					.list{
						position: relative;
						margin:15px 4.5vw 0;
						font-size: 13px;
						&:last-child{margin-bottom: 30px;}
						.name{
							position:absolute;
							top:8%;
							left:30%;
							font-size: 18px;
						}
						.icon{
							position:absolute;
							top:13%;
							height:74%;
							left:5%;
							img{
								width:auto;
								height:100%
							}
						}
						.detail{
							position:absolute;
							top:54%;
							left:30%;
							font-size: 18px;
						}
						
					}
				}
			}
		} 
  }
</style>
