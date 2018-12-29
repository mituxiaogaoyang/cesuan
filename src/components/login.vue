<template>
  <div id="login">
    <div class="login_box" v-show="loginPanel">
			<img src="../../static/imgs/login/login.png" alt="">
			<div class="top_btn cancel_btn" @click="closePop"><img src="../../static/imgs/login/cancel.png" ></div>
			<div class="top_btn sure_btn" @click="loginSubmit"><img src="../../static/imgs/login/sure_btn.png" ></div>
			<input type="text" class='name_input' v-model="account.name" autofocus="autofocus">
			<input type="password" class='pwd_input' v-model="account.pwd" >
      <div class="btn_others">
        <a class="btn_reg" @click="regBtn">注册</a>
        <a class="btn_pwd">找回密码</a>
      </div>
    </div>
    <div class="login_box" v-show="!loginPanel">
			<img src="../../static/imgs/login/reg.png" alt="">
			<div class="top_btn cancel_btn" @click="loginPanel=true"><img src="../../static/imgs/login/cancel.png" ></div>
			<div class="top_btn sure_btn" @click="regSubmit"><img src="../../static/imgs/login/sure_btn.png" ></div>
			<input type="text" class='name_input2' v-model="account.name" autofocus="autofocus">
			<input type="password" class='pwd_input2' v-model="account.pwd" >
			<input type="password" class='pwd_input22' v-model="account.pwd2" >
    </div>

  </div>
</template>
<script>
  import store from  '@/utils/store';
	import {ToastMe} from './toastSelf.js'
  export default {
    data(){
      return{
        loginPanel:true, //true为登录界面，false为注册界面
        account:{ //登录注册账号
          name:'',
          pwd:'',
          pwd2:''
        }
      }
    },
    methods:{
      closePop(){
        this.$emit('closeLogin')
				this.account.name='';
				this.account.pwd='';
      },
			regBtn(){
				this.loginPanel=false;
				this.account.name='';
				this.account.pwd='';
			},
      regSubmit(){ //提交注册信息
        const reg = '';
        let uName = this.account.name;
        let pwd1 = this.account.pwd;
        let pwd2 = this.account.pwd2;
        let token = store.getStore('token');
        if(uName.length<1){
          ToastMe('用户名不能为空')
        }
//        else if(!reg.test(uName)){
//          this.account.errorMessage1 ='用户名不符合规范'
//        }else if(!reg.test(pwd1)){
//          this.account.errorMessage2 ='密码不符合规范'
//        }
        else if(pwd2!==pwd1){
          ToastMe('两次密码不一致')
        }else{
          this.$axios.post('/api/users/register',{username:uName,password:pwd1}).then(res=>{ //,uuid:'iphonexxx'
            if(res&&res.status===200){
              if(res.data.code===200){
                store.setStore('token',res.data.token)
                this.loginSubmit();
              }else{
								ToastMe(res.data.err||res.data.msg)
							}
            }
          })
        }
      },
      loginSubmit(){ //提交登录信息
        let token = store.getStore();
        let uName = this.account.name ;
        let pwd = this.account.pwd;
        console.log(uName.length)
        if(uName.length && pwd.length){
          this.$axios.post('/api/users/login',{username:uName,password:pwd}).then(res=>{
            if(res&&res.status===200){
              if(res.data.code===200){
                store.setStore('token',res.data.token)
                ToastMe(uName+'登陆成功')
								store.setStore('nick',res.data.userInfo.name)
								store.setStore('mana',res.data.userInfo.mana)
								store.deleteStore('birthNameTemp')
                this.$emit('closeLogin')
              }else if(res.data.code===501){
								ToastMe(res.data.msg)
							}else{
								ToastMe(res.data.msg)
							}	
            }else{
              ToastMe('登录失败')
            }
          })
        }else{
          ToastMe('用户名或密码不能为空')
        }
      }
			
    }
  }
</script>
<style lang="less">
  #login{
    .login_box{
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
			input{
				position: absolute;
				left:40%;
				height:36px;
				line-height: 36px;
				background: none;
				border:none;
				font-size:16px;
				color:#000;
			}
			.name_input{
				top:26%;
			}
			.name_input2{
				top:22%;
			}
      .pwd_input{
      	top:48.5%;
      }
			.pwd_input2{
				top:41.5%;
			}
			.pwd_input22{
				top:63.5%;
			}
      .btn_others{
				position: absolute;
				bottom: 12%;
				left:15%;
        width:70%;
        a{
          text-decoration: underline;
					color:#04396a;
					font-size: 15px;
        }
        .btn_reg{
          float:left;
        }
        .btn_pwd{
          float:right;
        }
        &:after{
          content:"";
          display: block;
          clear:both
        }
      }
    }
  }
</style>
