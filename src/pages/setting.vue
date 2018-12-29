<template>
  <div id="setting">
    <div class="top">
    	<router-link :to="{name:'index'}" class="back"><img src="../../static/imgs/public/home.png" ></router-link>
    	<div class="title"><img src="../../static/imgs/setting/title.png" ></div>
    </div>
    <div class="avatar_box" v-if="accountTemp">
			<img src="../../static/imgs/setting/login.png">
      <div class="avatar">
				<img :src="user.avatar?'../../static/imgs/avatars/cat'+user.avatar+'.png':'../../static/imgs/avatars/avatar.png'">
				<div class="name_box">
					<img src="../../static/imgs/portrait/name_box.png" alt="">
					<div class="name">{{user.birthName}}</div>
				</div>
			</div>
      <div class="bot">
        <span class="nick_name">{{user.name}}</span>
        <div class="value">{{user.value}}</div>
      </div>
    </div>
		<div class="avatar_box" v-else  @click="panel.loginBox=true">
			<img src="../../static/imgs/setting/noLogin.png">
		</div>
    <div class="funcs">
			<img src="../../static/imgs/setting/lists.png" alt="">
			<div class="lists">
				<div class="list"><a @click="birthsManage"><img src="../../static/imgs/setting/list1.png" alt=""></a></div>
				<div class="list"><a @click="getDaysRecords"><img src="../../static/imgs/setting/list2.png" alt=""></a></div>
				<div class="list"><a @click="changePwd"><img src="../../static/imgs/setting/list3.png" alt=""></a></div>
				<div class="list"><a @click="manaGet"><img src="../../static/imgs/setting/list4.png" alt=""></a></div>
				<div class="list"><a class="btn_login" @click="panel.loginBox=true" v-if="accountTemp"><img src="../../static/imgs/setting/list5.png" alt=""></a></div>

			</div>
    </div>
		<van-popup v-model="panel.personSelected" class="form_pop birth_pop_outer">
			<div class="birth_pop">
				
				<div class="ceil">
					<a class="back" @click="panel.personSelected=false"><img src="../../static/imgs/public/back.png" alt=""></a>
					<img src="../../static/imgs/birthLists/title.png">
				</div>
				<div class="births">
					<img src="../../static/imgs/birthLists/bg.png">
					<div class="lists">
						<van-swipe-cell  :right-width="90" v-for="person in persons" :on-close='onClose(person.id)' :key='person.id'>
							<span slot="right" class="delete_birth"><img src="../../static/imgs/birthLists/delete.png"></span>
							<a class="list" @click='birthSelect(person.id,person.inuse)'>
								<div class="icon">
									<img :src="'../../static/imgs/avatars/cat'+person.HeadPortrait+'.png'">
								</div>
								<img src="../../static/imgs/birthLists/selected.png" v-if="person.inuse">
								<img src="../../static/imgs/birthLists/noSelected.png" v-else>
								<div class="name">{{person.name}}</div>
								<div class="gender">{{person.sex?'女':'男'}}</div>
								<div class="type">{{person.birthtype?'农历':'公历'}} {{person.birthday}}</div>
							</a>
						</van-swipe-cell>
						<a  class="add" @click="panel.birthAdd=true"><img src="../../static/imgs/birthLists/add.png"></a>
					</div>
				</div>
			</div>
		</van-popup>
    <van-popup v-model="panel.birthAdd" position="bottom">
      <birth-form @timePickerIn="panel.datePicker=true" @cancelBirthPop="panel.birthAdd=false"  @birthHide="addBirthAfter"></birth-form>
    </van-popup>
		<van-popup v-model="panel.dayPicked" class="form_pop birth_pop_outer">
			<div class="birth_pop">
				
				<div class="ceil">
					<a class="back" @click="panel.dayPicked=false"><img src="../../static/imgs/public/back.png" alt=""></a>
					<img src="../../static/imgs/dateLog/title.png">
				</div>
				<div class="births">
					<img src="../../static/imgs/birthLists/bg.png">
					<div class="lists2">
						<div class="list" v-for="list in dayLists" @click='showDetail(list.words)'>
							<img :src="'../../static/imgs/dateLog/type'+list.type+'.png'">
							<div class="name">{{list.name}}</div>
							<div class="detail" v-html="list.targetDay"></div>
						</div>
					</div>
				</div>
			</div>
		</van-popup>
		<van-popup v-model="panel.dayDetail" class="form_pop detail_pop">
			<div class="detail_box">
				<img src="../../static/imgs/home/pop_box.png" alt="">
				<div class="words" v-html="dayContent"></div>
			</div>
		</van-popup>
    <van-popup v-model="panel.loginBox" class="form_pop">
      <login-box @closeLogin="loginAgain"></login-box>
    </van-popup>
    <van-popup v-model="panel.valueGet" class="form_pop value_get">
      <value-get @closeValue="panel.valueGet=false" @recharged='recharged' :isBuy='buyflag'></value-get>
    </van-popup>
    <van-popup v-model="panel.newName" class="form_pop">
      <div class="new_name">
				<img src="../../static/imgs/setting/nickbox.png" alt="">
				<div class="top_btn cancel_btn" @click="panel.newName=false"><img src="../../static/imgs/login/cancel.png" ></div>
				<div class="top_btn sure_btn" @click="nameSubmit"><img src="../../static/imgs/login/sure_btn.png" ></div>
				<input type="text" class='nick_input' v-model="newName.name" :placeholder="user.name" autofocus="autofocus">
        <div class="require">
          昵称最长为六个字 <br>
          只能使用中文字符 <br>
          不允许出现各种敏感字和词语</br>
					*昵称不影响结果*
        </div>
      </div>
    </van-popup>
    <van-popup v-model="panel.newPwd" class="form_pop">
      <div class="new_name">
				<img src="../../static/imgs/setting/pwdbox.png" alt="">
				<div class="top_btn cancel_btn" @click="panel.newPwd=false"><img src="../../static/imgs/login/cancel.png" ></div>
				<div class="top_btn sure_btn" @click="pwdSubmit"><img src="../../static/imgs/login/sure_btn.png" ></div>
				<input type="password" class='pwd_input pwd_input1' v-model="pwdNew.v0"  autofocus="autofocus">
				<input type="password" class='pwd_input pwd_input2' v-model="pwdNew.v1" >
				<input type="password" class='pwd_input pwd_input3' v-model="pwdNew.v2" >
      </div>
    </van-popup>
  </div>
</template>

<script>
  import LoginBox from '@/components/login.vue'
  import  birthForm from '@/components/birthAdd.vue'
  import  valueGet from '@/components/valueGet.vue'
  import store from  '@/utils/store';
	import {ToastMe} from '../components/toastSelf.js'
  export default {
    data (){
      return{
        panel:{ //面板管理
          personSelected:false, //生日管理面板
          birthAdd: false, //添加生日面板
          dayPicked: false, //择日记录
          loginBox:false, // 登录框
          loginPanel:true, //登录框为登录而不是注册
          valueGet:false, //灵力兑换面板
          newName:false, //修改名字
          newPwd:false, //修改密码
					dayDetail:false  //择日结果详情
        },
        user:{ //用户信息
          birthName:store.getStore('birthName')||'未选择生日',
					name:'',
					avatar:store.getStore('avatar'),
          value:store.getStore('mana')||0
        },
        newName:{ //修改名字信息
          name:''
        },
        pwdNew:{//修改密码信息
					v0:'',
          v1:'',
          v2:''
        },
				dayContent:'',
        persons:[ ],//生日管理列表
        dayLists:[], //择日记录数据
        accountTemp:store.getStore('token'),
				buyflag:0
        
      }
    },
    components:{LoginBox,birthForm,valueGet},
	
    mounted(){
			this.user.name = store.getStore('nick')
			this.user.value = store.getStore('mana')
			this.user.birthName = store.getStore('birthName')
			this.viewMana()
			this.getListBirth()
			this.getBirthName()
    },
    methods:{
      getDate(v){ //获取选择时间
        let time = this.getFormatDate(v)
        
        this.panel.datePicker =false
      },
			manaGet(){
				if(store.getStore('token')){
					this.panel.valueGet=true
					this.$axios.post('/api/mana/everydayManaLog').then(res=>{
						if(res&&res.status===200){
							if(res.data.code===200){
								console.log(res.data)
								this.buyflag = res.data.flag
							}else{
								ToastMe(res.data.err)
							}
						}
					})
				}else{
					ToastMe('请先注册账户')
				}
			},
			getBirthName(){ //获取当前选中的生日 姓名
				if(store.getStore('token')){
					this.$axios.post('/api/birthday/getUsingBirthDay').then(res=>{
						if(res&&res.status===200){
							if(res.data.code===200){
								if(res.data.result){
									this.user.birthName = res.data.result.name ;
									this.user.avatar = res.data.result.headPortrait
									store.setStore('avatar',this.user.avatar)
									store.setStore('birthName',this.user.birthName)
								}else{
									this.user.avatar = null
									this.user.birthName = '未选择生日'
									store.deleteStore('avatar')
									store.deleteStore('birthName')
								}
								
							}
						}
					})
				}else{
					console.log('guest账户登录')
				}
				
			},
			onClose(id){ //生日List左右滑动删除处理
				let t =this;
				return function(pos,instance){
					if(pos==='right'){
						t.$axios.post('/api/birthday/deleteBirthDay',{id:id}).then(res=>{
							if(res&&res.status===200){
								if(res.data.code===200){
									ToastMe('删除成功'),
									t.getListBirth();
								}else{
									ToastMe(res.data.err)
								}
							}
						})
					}
				}
				
			},
			changePwd(){
				if(store.getStore('token')){
					this.panel.newPwd=true
				}else{
					ToastMe('请先注册账户')
				}
			},
			showDetail(word){
				this.panel.dayDetail = true
				this.dayContent = word;
			},
			loginAgain(){
				this.panel.loginBox=false ;
				this.accountTemp =true
				this.user.name = store.getStore('nick')
				this.user.value = store.getStore('mana')
				this.getBirthName();
				this.getListBirth();
				
			},
      getFormatDate(date) {
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentDate = date.getFullYear() + "-" + month + "-" + strDate ;
        return currentDate;
      },
			getDaysRecords(){ //择日记录
				if(store.getStore('token')){
					this.$axios.post('/api/zheri/getzheriList',{page:1,size:20}).then(res=>{
						if(res&&res.status===200){
							if(res.data.code===200){
								if(res.data.result){
									let lists = res.data.result.list
									for(let i =0,len = lists.length; i<len;i++){
										lists[i].words = `<span class="red">${lists[i].targetDay}</span>，${this.convert(lists[i].content)}`
									}
									
									this.dayLists = lists
								}
								this.panel.dayPicked=true
								if(res.data.result.total>10){
									ToastMe('择日记录多于20条，只显示20条')
								}
							}else{
								ToastMe(res.data.msg)
							}
						}
					})
				}else{
					ToastMe('请先注册账户')
				}
				
			},
			convert(str){ // #转代码
				let computed = str.replace(/\#([a-zA-Z0-9_\u4e00-\u9fa5]+)\#/g,function (match,key) {
					return '<span class="blue">'+key+'</span>';
				})
				return computed;
			},
      toLogin(){ //点击登录

      },
			recharged(v){
				this.user.value =store.getStore('mana') ;
				this.buyflag = v ;
				this.panel.valueGet = false
			},
      nameSubmit(){ //提交修改的名字
				let reg=/^[\u4e00-\u9fa5]{1,6}$/ ;
				let val = this.newName.name
				if(!val){
					ToastMe('昵称不能为空')	
				}else if(!reg.test(val)){
					ToastMe('昵称不符合规范')
				}else{
					this.$axios.post('/api/userSet/changeNickname',{nickname: val}).then(res=>{
						if(res&&res.status===200){
							if(res.data.code===200){
								ToastMe('昵称修改成功')
								this.user.name =  val;
								store.setStore('nick',val)
								this.panel.newName = false
							}else{
								ToastMe(res.data.error)
							}
						}
					})
				}
      },
      pwdSubmit(){ //提交修改的密码
				let v0 = this.pwdNew.v0, v1 = this.pwdNew.v1 , v2 =this.pwdNew.v2 ;
				if(v0.length&&v1.length&&v2.length){
					if(v1===v2){
						this.$axios.post('/api/userSet/changePass',{oldpassword:v0,password: v1}).then(res=>{
							if(res&&res.status===200){
								if(res.data.code===200){
									ToastMe('密码修改成功')
									this.panel.newPwd = false
								}else{
									ToastMe(res.data.msg)
								}
							}
						})
					}else{
						ToastMe('两次输入密码不一致')
					}
				}else{
					ToastMe('密码不能为空')
				}
				
      },
      birthsManage(){ //生日管理
				if(store.getStore('token')){
					this.panel.personSelected=true
				}else{
					ToastMe('请先注册账户')
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
      viewMana(){
        this.$axios.post('/api/mana/getMana').then(res=>{
          if(res&&res.status===200){
            if(res.data.code===200){
              this.user.value = res.data.mana         
            }
          }
        })
      },
			addBirthAfter(){ //添加生日成功后
				this.panel.birthAdd=false ;
				this.getListBirth();
				this.getBirthName();
			},
			birthSelect(id,tag){ //选择生日
				if(!tag){
					this.$axios.post('/api/birthday/useBirthDay',{id:id}).then(res=>{
						if(res&&res.status===200){
							if(res.data.code===200){
								this.getBirthName();
								this.getListBirth();
								this.panel.personSelected=false ;
							}
						}
					})
				}else{
					return false ;
				}
			}
    }
  }
</script>

<style lang="less">
  .van-picker-column:nth-child(5){display: none}
  #setting {
    height:100vh;
    width:100%;
		background:#fff url(../../static/imgs/public/bg.png) center bottom fixed no-repeat;
		background-size:cover;
		position: relative;
    img{display: block;width:100%}
    min-height: 100vh;
    .van-picker-column:last-child{display: none}
    a{
      display: block;
			cursor:pointer;
    }
    a:active{transform: scale(1.06);}
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
    .avatar_box{
      position:absolute;
      width:80vw;
      left:10vw;
      bottom:60vh;
      .avatar{
				position: absolute;
				top:2vh;
        width:28vw;
        left:50%;
				margin-left:-14vw;
				.name_box{
					position:absolute;
					bottom:-15px;
					left:1vw;
					right:1vw;
					text-align: center;
					.name{
						position: absolute;
						top:50%;
						left:0;
						width:100%;
						transform: translateY(-50%);
					}
				}
      }
      .bot{
        position: absolute;
				font-size: 16px;
        bottom:13%;
				width:100%;
				left:0;
				padding:0 6vw 0 15vw;
				box-sizing: border-box;
				line-height: 20px;
        .nick_name{
          float:left;
					max-width:40%;
					overflow:hidden;
					text-overflow:ellipsis;
					white-space:nowrap;
					word-break:break-word;
          span,i{vertical-align: middle}
					i{
						display: inline-block;
						width:5vw;
						margin-right:2vw;
					}
        }
        .value{
          position:absolute;
					top:0;
					left:75%;
        }
      }
      .login{
        width:30%;
        margin:2vh auto;
      }
    }
    .funcs{
			position:absolute;
			width:80vw;
			left:10vw;
			bottom:8vh;
			.lists{
				position: absolute;
				left:0;
				top:9%;
				bottom:5%;
				width:100%;
				.list{
					height:20%;
					position: relative;
					a{
						width:32%;
						margin:0 auto ;
						line-height: 1;
						padding-top:2.6vh;
						box-sizing: border-box;
					}
				}
			}
		}
		.birth_pop{
			position: relative;

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
		}
		.btn_login{
      width:50vw;
      margin:32px auto;
      height:36px;
      line-height: 36px;
     
      text-align: center;
    }
		.detail_pop{background: rgba(255,255,255,0);}
		.detail_box{
			width:80%;
			margin:0 auto;
			position: relative;
			.words{
				font-size: 20px;
				position:absolute;
				top:48%;
				left:0;
				transform: translateY(-50%);
				padding: 3vh 6vw; 
				text-indent: 2em;
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
    .form_pop{
      width:100%;
      top:48%;
			&.birth_pop_outer{
				width:86%;
				top:55%;
			}
			&.value_get{
				background-color: rgba(255,255,255,.2);
			}
    }
//     .day_picked{
//       
//       .lists{
//         .list{
//           position: relative;
//           padding:12px 10px 15px 12px;
//           border:1px solid #999;
//           box-shadow: 0 0  5px  #999;
//           border-radius: 5px;
//           margin:12px;
//           .name{
//             text-align: center;
//             font-size: 16px;
//             margin-bottom: 6px;
//           }
//           .bot{
//             position: relative;
//             padding-left:60px;
//             .icon{
//               height:100%;
//               position: absolute;
//               top:0;
//               left:0;
//               width:50px;
//               background-size:45px 45px;
//               background-repeat: no-repeat;
//               background-position: center center;
//               background-image: url(../assets/imgs/setting/icon.png);
//             }
//           }
//         }
//       }
//     }
    .new_name{
      .top_btn{
				position:absolute;
				height:16%;
				top:0;
				img{
					width:auto;
					height:56%;
					vertical-align: middle;
					transform: translateY(45%);
				}
			}
			.sure_btn{
				right:3vw;
				img{
					height:62%;
					transform: translateY(36%);
				}
			}
			.cancel_btn{
				left:3vw;
			}
			.nick_input{
				position: absolute;
				top:34%;
				left:33%;
				height:32px;
				line-height: 32px;
				background: none;
				border:none;
				font-size:16px;
				color:#000;
			}
      .require{
				position: absolute;
				font-size: 16px;
				top:52%;
				left:0;
				width:100%;
        text-align: center;
        line-height: 1.5;
      }
			.pwd_input{
				position: absolute;
				left:33%;
				height:32px;
				line-height: 32px;
				background: none;
			  border:none;
				font-size:18px;
				color:#000;
			}
			.pwd_input1{
				top:26%;
			}
			.pwd_input2{
				top:49%;
			}
			.pwd_input3{
				top:71%;
			}
    }
  }
</style>
