<template>
  <div id="sign">
		<div class="top">
			<router-link :to="{name:'index'}" class="back"><img src="../../static/imgs/public/home.png" ></router-link>
			<div class="title"><img src="../../static/imgs/signs/title.png" ></div>
		</div>
    <div class="core">
      <div class="name">
				<img src="../../static/imgs/signs/nameBg.png" alt="">
				<div class="words">{{infoMain.name}}</div>
			</div>
			<div class="box" @click="drawNext">
				<img src="../../static/imgs/signs/sign_box.png" alt="">
				<div class="bg_words" v-show='infoMain.userprogress===0'><img src="../../static/imgs/signs/bg_word.png" alt=""></div>
				<div class="img_box">
					<div class="img">
						<div class="first"><img src="../../static/imgs/signs/lingfu-diban.png" alt=""></div>
						<!-- <div class="full"><img :src="'../../static/imgs/signs/steps/'+infoMain.id+'/'+'0.png'"></div> -->
						<div class="others" v-if='infoMain.userprogress' :class="{animate:animate}"><img :src="'../../static/imgs/signs/steps/'+infoMain.id+'/'+1+'.png'"></div>
						<div class="others" v-if='infoMain.share' ><img :src="'../../static/imgs/signs/seal.png'"></div>
					</div>
				</div>
				<div class="desc">{{infoMain.desc}}</div>
			</div>
			<div class="bot">
				<a class="btn_share" @click="shareDirect" v-show="infoMain.userprogress">分享</a>
				<!-- <a class="btn_draw" @click=drawNext><img src="../../static/imgs/signs/draw.png" alt=""></a> -->
				<a class="btn_select" @click="getAllSign">选符</a>
			</div>
    </div>
    
    <van-popup v-model="panel.signs" position="bottom">
      <div class="signs_box">
				<a class="back" @click="panel.signs = false"><img src="../../static/imgs/public/back.png" alt=""></a>
				<img src="../../static/imgs/signs/bg_select.png">
        <div class="tabbar">
					<a class="tab" @click='signsData.type=0'>
						<img src="../../static/imgs/signs/tab_selected.png" v-if='signsData.type===0'>
						<img src="../../static/imgs/signs/tab_noSelected.png" v-else>
						<div class="words"><img src="../../static/imgs/signs/tab_func.png" alt=""></div>
					</a>
					<a class="tab" @click='signsData.type=1'>
						<img src="../../static/imgs/signs/tab_selected.png" v-if='signsData.type===1'>
						<img src="../../static/imgs/signs/tab_noSelected.png" v-else>
						<div class="words"><img src="../../static/imgs/signs/tab_amuse.png" alt=""></div>
					</a>
        </div>
        <div class="panel" v-show="signsData.type===0">
          <div class="lists" >
            <a class="list" v-for="list in signsData.funcLists" @click="viewInfo(list)">
              <img src="../../static/imgs/signs/lingfu-diban.png">
							<div class="full"><img :src="'../../static/imgs/signs/steps/'+list.id+'/'+'0.png'"></div>
							<!-- <div class="others" v-for='n in list.userprogress' :style="{zIndex:n}"><img :src="'../../static/imgs/signs/steps/'+list.id+'/'+n+'.png'"></div> -->
							<div class="others" v-if='list.userprogress' ><img :src="'../../static/imgs/signs/steps/'+list.id+'/'+1+'.png'"></div>
							<div class="others" v-if='list.share' ><img :src="'../../static/imgs/signs/seal.png'"></div>
              <span class="name">{{list.name}}</span>
              <!--<div class="degree">{{list.finished}}</div>-->
            </a>
            <div class="listempty"></div>
          </div>
          <div class="pages">
            <van-pagination
              v-model="signsData.pager1.now"
              :page-count="signsData.pager1.pageNum"
              mode="simple"
							@change='pager1Change'
            />
          </div>
        </div>
        <div class="panel" v-show="signsData.type!=0">
          <div class="lists">
            <a class="list" v-for="list in signsData.amuseLists" @click="viewInfo(list)">
              <img src="../../static/imgs/signs/lingfu-diban.png">
							<div class="full"><img :src="'../../static/imgs/signs/steps/'+list.id+'/'+'full.png'"></div>
              <div class="others" v-for='n in list.userprogress' :style="{zIndex:n}"><img :src="'../../static/imgs/signs/steps/'+list.id+'/'+n+'.png'"></div>
              <div class="others" v-if='list.share' ><img :src="'../../static/imgs/signs/seal.png'"></div>
							<span class="name">{{list.name}}</span>
              <!--<div class="degree">{{list.finished}}</div>-->
            </a>
						<div class="listempty"></div>
          </div>
          <div class="pages">
            <van-pagination
              v-model="signsData.pager2.now"
              :page-count="signsData.pager2.pageNum"
              mode="simple"
							@change='pager1Change'
            />
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="panel.value" class="value">
      <div class="value_box">
				<img src="../../static/imgs/signs/view_box.png">
        <div class="info">
          <div class="img">
            <img src="../../static/imgs/signs/lingfu-diban.png">
						<div class="full"><img :src="'../../static/imgs/signs/steps/'+panelView.id+'/'+'0.png'"></div>
          </div>
          <div class="item">
            <div class="name">{{panelView.name}}</div>
            <div class="value">{{panelView.des}}</div>
          </div>
        </div>
        <a class="btn_sure" @click="signSubmit(panelView.id)" v-if='panelView.isKeep'><img src="../../static/imgs/signs/choose.png"></a>
				<div class="word_notify" v-else>每天只能解锁一张符</div>
      </div>
    </van-popup>
    <van-popup v-model="panel.lack" class="value">
      <value-lack  @closeLack="panel.lack=false" @openLogin="panel.loginBox=true" @openGet="panel.valueGet=true"></value-lack>
    </van-popup>
    <van-popup v-model="panel.loginBox" class="form_pop">
      <login-box @closeLogin="panel.loginBox=false"></login-box>
    </van-popup>
		<van-popup v-model="panel.valueGet" class="form_pop">
			<value-get @closeValue="panel.valueGet=false;panel.lack=false" @recharged='recharged'></value-get>
		</van-popup>
		<van-popup v-model="panel.share" class="share_pop">
			<div class="share_box">
				<img src="../../static/imgs/signs/lingfu-diban.png">
				
				<div class="others"><img :src="'../../static/imgs/signs/steps/'+infoMain.id+'/'+'1.png'"></div>
				<!-- <div class="others" v-for='n in panelView.steps' :style="{zIndex:n}" v-else><img :src="'../../static/imgs/signs/steps/'+panelView.id+'/'+n+'.png'"></div> -->
				<div class="seal"><img :src="'../../static/imgs/signs/seal.png'"></div>
			</div>
		</van-popup>
  </div>
</template>

<script>
  import ValueLack from '@/components/valueLack.vue'
	import ValueGet from '@/components/valueGet.vue'
  import LoginBox from '@/components/login.vue'
	import store from '@/utils/store.js';
	import {arrLocal} from './data.js'
	import {ToastMe} from '../components/toastSelf.js'
  export default {
    data() {
      return {
        panel:{
          signs:false, //选符面板
          value:false, //灵力信息面板
          lack:false, // 灵力不足面板
					valueGet:false, // 灵力兑换面板
					share:false, //分享面板
          loginBox:false //登录面板
        },
				animate:false,
				share:{
					direct:true  //true：分享键直接分享  false:选符面板点击分享
				},
				infoMain:{ //刚进入页面展示信息
					id:'',
					name:'',
					desc:'',
					steps:0,
					stepsAll:4,
					manaEach:50
				},
        panelView:{ //临时选中的灵符信息
          id:1,
					imgUrl:'',
          name:'魅力符',
          value:500,
          finished:20,
					steps:0,
					stepsAll:4,
          desc:'魅力无限，全场焦点'
        },
        signsData:{
          type:1,
          pager1:{now:1,pageNum:3},
          pager2:{now:1,pageNum:1},
          funcLists:[],
          amuseLists:[]
        },
				
      };
    },
    components:{ValueLack, LoginBox,ValueGet},
		mounted(){
			this.checkSign();
		},
    methods: {
      changeStatus (index){ //更改折叠状态
        console.log(index)
      },
			checkSign(){ //获取灵符(初次进入加载)
				let queryId = this.$route.query.id 
				let list1 =[],list2=[] ;
				this.$axios.post('/api/magicFigures/getUserProgress').then(res=>{
					if(res&&res.status===200){
						if(res.data.code===200){
							let lists = res.data.result ;
							for(let i=0,len=lists.length; i<len;i++){ //合并本地数据和网络传输数据
								Object.assign(lists[i],arrLocal[i])
								if(lists[i].type===1){
									list1.push(lists[i])
								}else{
									list2.push(lists[i])
								}
							}
							this.lists1 = list1 
							this.lists2 = list2
							this.signsData.pager1.now = 1  
							this.signsData.pager2.now = 1 
							this.signsData.pager1.pageNum  = Math.ceil(list1.length/6)
							this.signsData.pager2.pageNum  = Math.ceil(list2.length/6)
							this.signsData.funcLists = list1.slice((this.signsData.pager1.now-1)*6,this.signsData.pager1.now*6) ;
							this.signsData.amuseLists = list2.slice((this.signsData.pager2.now-1)*6,this.signsData.pager2.now*6);
							
							if(queryId){ //从周卡选服页面进入
								for(let i=0,len=lists.length;i<len;i++){
									if(lists[i].id === queryId){
										if(lists[i].activation){
											this.infoMain = lists[i]
										}else{
											this.panelView = lists[i]
											this.panel.value = true
											this.infoMain = lists.find((obj)=>{return obj.id ===2001})
										}
										
									}
								}
							}else{
								
								this.panel.signs = true
								
								this.infoMain = lists.find((obj)=>{return obj.id === 2001})
							}
							
						}else{
							ToastMe(res.data.err)
						}
					}
				})
				
// 				this.$axios.post('/api/magicFigures/getUserProgress').then(res=>{
// 					if(res&&res.status===200){
// 						if(res.data.code===200){
// 							let lists = res.data.result ;
// 							let _t = this;
// 							let list1 =[],list2=[],len=lists.length,flag = false;// 根据type把结果分为两类
// 							for(let i=0; i<len;i++){
// 								Object.assign(lists[i],arrLocal[i])
// 								if(lists[i].choosed){ //有被选中的灵符
// 									flag=true ;
// 									_t.infoMain.id= lists[i].id;
// 									_t.infoMain.name= lists[i].name;
// 									_t.infoMain.desc= lists[i].des;
// 									_t.infoMain.steps =lists[i].userprogress ;
// 									_t.infoMain.stepsAll =lists[i].progress ;
// 									_t.infoMain.manaEach=lists[i].cost/lists[i].progress
// 								}
// 								if(lists[i].type===1){
// 									list1.push(lists[i])
// 								}else{
// 									list2.push(lists[i])
// 								}
// 							}
// 							
// 							if(!flag){
// 								this.panel.signs = true ;
// 							}
// 							this.lists1 = list1 
// 							this.lists2 = list2
// 							this.signsData.pager1.now = 1 
// 							this.signsData.pager2.now = 1 
// 							this.signsData.pager1.pageNum  = Math.ceil(list1.length/6)
// 							this.signsData.pager2.pageNum  = Math.ceil(list2.length/6)
// 							this.signsData.funcLists = list1.slice(0,6) ;
// 							this.signsData.amuseLists = list2.slice(0,6) ; 
// 							
// 						}
// 					}
// 				})
			},
			getAllSign(){ //获取所有灵符(重新获取)
				
				this.$axios.post('/api/magicFigures/getUserProgress').then(res=>{
					if(res&&res.status===200){
						if(res.data.code===200){
							let lists = res.data.result ;
							console.log(lists)
							let list1 =[],list2=[],len=lists.length,flag = false;// 根据type把结果分为两类
							for(let i=0; i<len;i++){
								Object.assign(lists[i],arrLocal[i])
							
								if(lists[i].type===1){
									list1.push(lists[i])
								}else{
									list2.push(lists[i])
								}
							}
							this.lists1 = list1 
							this.lists2 = list2
							this.signsData.pager1.now = 1  
							this.signsData.pager2.now = 1 
							this.signsData.pager1.pageNum  = Math.ceil(list1.length/6)
							this.signsData.pager2.pageNum  = Math.ceil(list2.length/6)
							this.signsData.funcLists = list1.slice((this.signsData.pager1.now-1)*6,this.signsData.pager1.now*6) ;
							this.signsData.amuseLists = list2.slice((this.signsData.pager2.now-1)*6,this.signsData.pager2.now*6);
							
						}
					}
				})
				this.panel.signs = true ;
			},
			pager1Change(){
				let n = this.signsData.pager1.now
				this.signsData.funcLists = this.lists1.slice((this.signsData.pager1.now-1)*6,this.signsData.pager1.now*6) ;
			},
			pager2Change(){
				this.signsData.amuseLists = this.lists2.slice((this.signsData.pager2.now-1)*6,this.signsData.pager2.now*6);
			},
			shareDirect(){
				this.$axios.post('/api/magicFigures/share',{id:this.infoMain.id}).then(res=>{
					if(res&&res.status===200){
						if(res.data.code===200){
							this.infoMain.share = true
							this.panel.share = true ;
						}else{
							ToastMe(res.data.err)
						}
					}
				})
				
				
			},
      viewInfo(obj){
				if(obj.activation){
					this.panel.signs = false 
					this.infoMain = obj ;
				}else{
					this.$axios.post('/api/magicFigures/todayBuy').then(res=>{
						if(res&&res.status===200){
							if(res.data.code===200){
								this.panelView = obj ;
								if(res.data.buyflag){
									this.panelView.isKeep = 0
								}else{
									this.panelView.isKeep = 1
								}
								
								this.panel.value = true
							}else{
								ToastMe(res.data.err)
							}
						}
					})
					
					
				}
      },
			recharged(v){
				this.panel.lack = false
				this.panel.valueGet = false
			},
      signSubmit(id){
				this.$axios.post('/api/magicFigures/choose',{id:id}).then(res=>{
					if(res&&res.status===200){
						if(res.data.code===200){
							this.panel.value = false;
							this.panel.signs=false ;
							this.infoMain.id= id;
							this.infoMain = this.panelView ;
// 							this.infoMain.name= this.panelView.name;
// 							this.infoMain.desc= this.panelView.desc;
// 							this.infoMain.steps = this.panelView.steps;
// 							this.infoMain.stepsAll = this.panelView.stepsAll;
// 							this.infoMain.manaEach=this.panelView.value/this.panelView.stepsAll;
						}else{
							ToastMe(res.data.err)
						}
					}
				})
      },
			drawNext(){ //画符
				if(this.infoMain.userprogress){
					return false
				}else{
					this.$axios.post('/api/magicFigures/drawing',{id:this.infoMain.id}).then(res=>{
						if(res&&res.status===200){
							if(res.data.code===200){
								this.infoMain.userprogress = 1
								this.animate = true 
								setTimeout(()=>{this.animate = false },5000)
							}else if(res.data.code===500){
								ToastMe(res.data.err)
								
							}else{
								ToastMe(res.data.err)
							}
						}
					})
				}
			}
    }
  };
</script>

<style lang="less">
  #sign{
		color:#2e5b77;
		background:#fff url(../../static/imgs/public/bg.png) center bottom fixed no-repeat;
		background-size:cover;
    img{display: block;width:100%}
		min-height:100vh;
    a{
      display: block;
      color:#2e5b77;
      text-decoration: underline;
      &.alert{
        color:#fd917d
      }
    }
    a:active{transform: scale(1.06);}
    .van-modal{background-color: rgba(255,255,255,.7)}
    .van-popup{overflow: visible}
		.form_pop{width:100%;}
    .van-popup.value{width:72%;background: transparent;}
		.van-pagination__item{color:#2e5b77;background: transparent;}
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
    		width:80vw;
    		margin:2.8vh auto;
    	}
    	
    }
    .core{
			width:90%;
      text-align: center;
      font-size: 16px;
			position:absolute;
			top:55%;
			left:5%;
			transform: translateY(-50%);
      .name{
        font-size: 18px;
				position:relative;
				.words{
					position:absolute;
					left:0;
					top:50%;
					transform: translateY(-50%);
					width:100%;
					text-align: center;
				}
      }
			.box{
				margin-top:2vh;
				position:relative;
				.bg_words{
					position:absolute;
					font-size: 30px;
					width:70%;
					left:15%;
					top:66%;
					z-index:10;
					animation:fadeIn 0.2s ;
				}
				.img_box{
					position: absolute;
					left:0;
					top:0;
					right:0;
					bottom:60px;
					.img{
						width:55%;
						margin:25px auto 0;
						position: relative;
						.full{
							position: absolute;
							top:0;
							left:0;
							bottom:0;
							right:0;
							z-index:0;
						}
						.others{
							position: absolute;
							top:0;
							left:0;
							bottom:0;
							right:0;
							z-index:2;
							&.animate{
								animation:fadeInScale 1.6s ease-in;
							}
							
						}
					}
				}
				@keyframes fadeIn{
					from {opacity:0;}
					to {opacity:1}
				}
				@keyframes fadeInScale{
					0% {opacity:0;transform: scale(3);}
					100% {opacity:1;transform: scale(1);}
				}
				.desc{
					position: absolute;
					bottom:12px;
					left:0;
					width:100%;
					text-align: center;
				}
			}
			.bot{
				margin:4vh 10vw  0;
				position: relative;
				font-weight: bold;
				font-size: 18px;
				.btn_draw{
					width:36vw;
					margin:0 auto;
				}
				.btn_share{
					float:left;
				}
				.btn_select{
					float:right;
				}
				&:after{
					content:'';
					display: block;
					clear:both;
				}
				.price{
					text-align: center;
					margin-top: 1.2vh;
					font-size: 16px;
				}
			}
    }
    
    .signs_box{
			position:relative;
			.back{
				position: absolute;
				height:4.5vh;
				left:2vw;
				top:1.3vh;;
				img{
					width:auto;
					height:100%;
				}
			}
      .tabbar{
				position:absolute;
				top:12%;
				left:12vw;
				right:12vw;
				display: flex;
				justify-content:space-between;
				.tab{
					width:32vw;
					position: relative;
					.words{
						position: absolute;
						width:16vw;
						top:50%;
						left:8vw;
						transform: translateY(-50%);
					}
				}
			}
			.panel{
				position:absolute;
				top:20%;
				left:0;
				width:100%;
				bottom:0;
				.lists{
					display: flex;
					justify-content:space-between;
					flex-wrap:wrap;
					padding:0 12vw;
					.list{
						width:27%;
						text-align: center;
						margin-top:10px ;
						position:relative;
						overflow: hidden;
						.name{
							position: absolute;
							bottom:0px;
							width: 100%;
							z-index:100;
							left:0;
							color:#c76155;
							display: block;
						}
						.others{
							position: absolute;
							top:0;
							width: 100%;
							left:0;
						}
						.full{
							position: absolute;
							top:0;
							left:0;
							bottom:0;
							right:0;
							z-index:0;
						}
					}
					.listempty {
						height: 0px;
						width: 27%;
					}
				}
				
			}
      
      .pages{
				position: absolute;
				bottom:0;
				left:0;
				width:100%;
			}
    }
    .value_box{
      position: relative;
      .info{
				position:absolute;
				top:12%;left:8%;
				width:84%;
        .img{
          width:28%;
          float:left;
					position: relative;
					.others{
						position: absolute;
						top:0;
						width: 100%;
						left:0;
					}
					.full{
						position: absolute;
						top:0;
						left:0;
						bottom:0;
						right:0;
						z-index:0;
					}
        }
        .item{
          width:60%;
          float:right;
          text-align: center;
          .name{font-size: 20px;}
          .value{
						margin-top:5vh ;
						font-size: 18px;
						text-align: left;
						text-indent: 2em;
					}
					.finished{
						position: relative;
						.bg{
							position: absolute;
							top:2px;left:2px;
							bottom:2px;
							z-index:5;
							max-width: 96%!important;
							background-color: #bbe4f0;
							border-radius: 12px ;
						}
						.percent_value{
							position: absolute;
							z-index:6;
							top:50%;;
							left:50%;
							transform: translate(-50%,-50%);
						}
					}
        }
        &:after{
          content: '';
          display: block;
          clear:both
        }
      }
      .desc{
				position: absolute;
				bottom:25%;
				left:0;
				width: 100%;;
        text-align: center;
        margin:2vh 0;
        font-size: 16px;
      }
      .btn_sure{
        position:absolute;
				bottom:9%;
				width:45%;
				left:27.5%;
      }
			.word_notify{
				position:absolute;
				bottom:9%;
				left:0;
				width:100%;
				text-align: center;
				font-size: 15px;
			}
    }
		.share_pop{width:60%}
		.share_box{
			position: relative;
			.others{
				position: absolute;
				top:0;
				width: 100%;
				left:0;
			}
			.seal{
				position: absolute;
				top:0;
				left:0;
				width: 100%;
				z-index:1000;
			}
		}
    
  }
</style>
