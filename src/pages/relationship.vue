<template>
	<div id="relation">
		<div class="top">
			<router-link :to="{name:'portrait'}" class="back"><img src="../../static/imgs/public/back.png" ></router-link>
			<div class="title"><img src="../../static/imgs/relation/title.png" ></div>
			<div class="corner corner1"><img src="../../static/imgs/relation/corner.png"></div>
			<div class="corner corner2"><img src="../../static/imgs/relation/corner.png"></div>
		</div>
		<div class="relation">
			<div class="mid">
				<div class="left">
					<div class="avatar_box" @click='openBirths("a")' :style="{width:(relationWords.size)[0]*100+'%',marginTop:(0.5-(relationWords.size)[0]/2)*100+'%'}">
						<img src="../../static/imgs/relation/avatar.png" alt="">
						<div class="avatar_img"><img :src="'../../static/imgs/avatars/cat'+aObj.avatar+'.png'"></div>
						<div class="name_box">
							<img src="../../static/imgs/portrait/name_box.png" alt="">
							<div class="name">{{aObj.name}}</div>
						</div>
					</div>
				</div>
				<div class="right">
					<div class="avatar_box" @click='openBirths("b")' :style="{width:(relationWords.size)[1]*100+'%',marginTop:(0.5-(relationWords.size)[1]/2)*100+'%'}">
						<img src="../../static/imgs/relation/avatar.png" alt="">
						<div class="avatar_img" v-if='bObj.id'><img :src="'../../static/imgs/avatars/cat'+bObj.avatar+'.png'"></div>
						<div class="name_box">
							<img src="../../static/imgs/portrait/name_box.png" alt="">
							<div class="name">{{bObj.name}}</div>
						</div>
					</div>
				</div>
				<div class="contact" v-show='relationWords.ab'>
					<img src="../../static/imgs/relation/mid_line.png" alt="">
					<div class="words">{{relationWords.ab}}</div>
				</div>
			</div>
			<div class="line_out top1_box" v-show='relationWords.a1'>
				<img src="../../static/imgs/relation/top1.png" alt="">
				<div class="words">{{relationWords.a1}}</div>
			</div>
			<div class="line_out top2_box" v-show='relationWords.a2'>
				<img src="../../static/imgs/relation/top1.png" alt="">
				<div class="words">{{relationWords.a2}}</div>
			</div>
			<div class="line_out top3_box" v-show='relationWords.b1'>
				<img src="../../static/imgs/relation/bot2.png" alt="">
				<div class="words">{{relationWords.b1}}</div>
			</div>
			<div class="line_out top4_box" v-show='relationWords.b2'>
				<img src="../../static/imgs/relation/bot1.png" alt="">
				<div class="words">{{relationWords.b2}}</div>
			</div>
		</div>
		
		<div class="bot">
			<img src="../../static/imgs/relation/bot_box.png">
			<div class="corner corner3"><img src="../../static/imgs/relation/corner.png"></div>
			<div class="corner corner4"><img src="../../static/imgs/relation/corner.png"></div>
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
	import {ToastMe} from '../components/toastSelf.js'
	export default {
		data() {
			return {
				personSelected:false, //生日选择面板
				persons:[ ],//生日管理列表
				aObj:{id:1,time:'',type:'',name:'',avatar:''}, //第一个头像框对象
				bObj:{id:0,time:'',type:'',name:'',avatar:''}, //第二个头像框对象
				aOrb: 'a', //当前生日列表是点哪个头像激活的
				relationWords:{
					a1:'',
					a2:'',
					b1:'',
					b2:'',
					ab:'',
					size:[1,0.8]
				}
			};
		},
		mounted(){
			this.aObj = this.$route.query
			this.getListBirth()
		},
		methods:{
			getRelation(){
				let aTime = this.aObj.time,bTime = this.bObj.time,aType =this.aObj.type,bType =this.bObj.type 
				this.$axios.post('/api/relation/getRelation',{"a_birthday":aTime,"a_birthtype":aType,"b_birthday":bTime,"b_birthtype":bType}).then(res=>{
					if(res&&res.status===200){
						if(res.data.code===200){
							if(res.data.result){
								let result = res.data.result
								let ab = result.relationsAB
								let ba =result.relationsBA
								let abba = result.sames
								let score = Number(result.score)
								switch(ab.length){
									case 0:
										this.relationWords.a1 = '';
										this.relationWords.a2 = '';
									break;
									case 1:
										this.relationWords.a1 = ab[0].length>4?ab[0]:''
										this.relationWords.a2 = ab[0].length>4?'':ab[0]
									break;
									default:
										
										this.relationWords.a1 = (ab[0].length>ab[1].length) ? ab[0]:ab[1]
										this.relationWords.a2 = (ab[0].length>ab[1].length) ? ab[1]:ab[0]
								}
								switch(ba.length){
									case 0:
										this.relationWords.b1 = '';
										this.relationWords.b2 = '';
									break;
									case 1:
										this.relationWords.b2 = ba[0].length>4?ba[0]:''
										this.relationWords.b1 = ba[0].length>4?'':ba[0]
									break;
									default:
										this.relationWords.b1 = (ba[0].length>ba[1].length) ? ba[1]:ba[0]
										this.relationWords.b2 = (ba[0].length>ba[1].length) ? ba[0]:ba[1]
								}
								this.relationWords.ab = abba.join(' ')
								switch(score){
									case -1:
										this.relationWords.size = [0.8,1]
									break;
									case 0:
										this.relationWords.size = [0.9,0.9]
									break;
									case 1:
										this.relationWords.size = [1,0.8]
									break;
								}
								
							}
							
						}
					}
				})
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
			openBirths(type){
				this.personSelected=true
				this.aOrb = type
			},
			birthSelect(day,type,tag,id,name,avatar){ //选择生日
				if(!tag){
					let lists = this.persons
					let _this = this
					if(this.aOrb == 'b'&&this.bObj.id===0){ //第一次填充b头像
						let list = lists.find((obj)=>{
							return obj.id === id
						})
						list.inuse = 1  //将选中的设置为1：在使用
						this.bObj = {id:id,time:day,type:type,name:name,avatar:avatar}
					}else if(this.aOrb == 'a'&&this.bObj.id===0){
						ToastMe('请先确定另一个生日')
					}else{
						let list1 = lists.find((obj)=>{
							return obj.id === id
						})
						list1.inuse = 1
						console.log(typeof (this[this.aOrb+'Obj'].id))
						let list2 = lists.find((obj)=>{
							return obj.id === Number(this[this.aOrb+'Obj'].id)
						})
					
						list2.inuse = 0 //将a或b之前在用的状态设置为0：未使用
						this[this.aOrb+'Obj'] = {id:id,time:day,type:type,name:name,avatar:avatar}
					}
					this.personSelected = false
					this.getRelation()
				}else{
					return false ;
				}
			},
		}
	}
</script>

<style lang='less'>
	@font-face{
			font-family: 'font1';               /*自定义字体名称*/
			src: url('../../static/font/font1.TTF') format('woff');         /*现代浏览器*/
			src:  url('../../static/font/font1.TTF') format('truetype');     /*Safari,Android,iOS*/
	}
	#relation{
		height:100vh;
		width:100%;
		overflow: hidden;
		background:#fff url(../../static/imgs/relation/bg.png) center bottom fixed no-repeat;
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
				height:4.6vh;
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
		.relation{
			position:absolute;
			top:53%;
			left:5%;
			width:90%;
			transform: translateY(-50%);
			.mid{
				.left{float:left;width:34%;}
				.right{float:right;width:34%;
					.avatar_box{float:right}
				}
				.avatar_box{
					position: relative;
					.avatar_img{
						position: absolute;
						top:9.5%;
						left:9.5%;
						width:81%;
					}
					.name_box{
						position: absolute;
						bottom:-3%;
						left:5%;
						width:90%;
						.name{
							position: absolute;
							top:50%;left:5%;
							width:90%;
							text-align: center;
							transform: translateY(-50%);
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
				}
				&:after{
					content: '';
					display: block;
					clear:both
				}
				.contact{
					position: absolute;
					left:32%;
					width:36%;
					top:50%;
					transform: translateY(-50%);
					.words{
						position: absolute;
						width:100%;
						left:0;
						top:60%;
						text-align: center;
						transform: translateY(-50%);
						font-family: 'font1'; 
						font-size: 28px;
					}
				}
			}
			.line_out{
				position: absolute;
				width:90%;
				left:5%;
				font-family: 'font1'; 
				.words{
					position:absolute;
					left:26%;
					width:48%;
					text-align: center;
					font-size: 28px;
					top:-15px;
				}
			}
			.top1_box{
				bottom:180%;
			}
			.top2_box{
				bottom:130%;
				width:76%;
				left:12%;
			}
			.top3_box{
				top:130%;
				width:76%;
				left:12%;
				.words{
					top:auto;bottom:-15px;
				}
			}
			.top4_box{
				top:180%;
				.words{
					top:auto;bottom:-15px;
				}
			}
		}
		.bot{
			position: absolute;
			bottom: 0;
			left:0;
			width:100%;
		}
		.corner{
			width:14vw;
			position: absolute;
			&.corner1{
				top:100%;
				left:0;
			}
			&.corner2{
				top:100%;
				right:0;
				transform: rotate(90deg);
			}
			&.corner3{
				bottom:100%;
				left:0;
				transform: rotate(270deg);
			}
			&.corner4{
				bottom:100%;
				right:0;
				transform: rotate(180deg);
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
					width:100%;
					height:100%;
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
						margin:20px 4.5vw ;
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
