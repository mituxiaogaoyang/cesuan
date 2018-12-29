<template>
  <div id="birth_add">
		<div class="top_box">
			<img src="../../static/imgs/birthInput/bg.png">
			<div class="top_btn cancel_btn" @click="cancelBirthPop"><img src="../../static/imgs/login/cancel.png" ></div>
			<div class="top_btn sure_btn" @click="birthSubmit"><img src="../../static/imgs/login/sure_btn.png" ></div>
			<input type="text" class="birthname" v-model="birth.name">
			<div class="date_add">{{(birth.calendar==1?'农历':'公历')+' '+timeShow}}</div>
			<div class="types">
				<input type="radio" id="0" value="0" v-model="birth.calendar" class="radio_box">
				<label for="0" class="gong">
					<img src="../../static/imgs/birthInput/gong.png">
					<span class="bg"  v-show="birth.calendar==='0'"><img src="../../static/imgs/birthInput/typeBg.png" alt=""></span>
				</label>
				<input type="radio" id="1" value="1" v-model="birth.calendar" class="radio_box">
				<label for="1" class="nong">
					<img src="../../static/imgs/birthInput/nong.png">
					<span class="bg" v-show="birth.calendar==='1'"><img src="../../static/imgs/birthInput/typeBg.png" alt=""></span>
				</label>
			</div>
			<div class="gender">
				<input type="radio" id="00" value="0" v-model="birth.gender" class="radio_box">
				<label for="00" class="gong">
					<img src="../../static/imgs/birthInput/selected.png" v-if="birth.gender==='0'">
					<img src="../../static/imgs/birthInput/noSelected.png" v-else>
				</label>
				<input type="radio" id="11" value="1" v-model="birth.gender" class="radio_box">
				<label for="11" class="nong">
					<img src="../../static/imgs/birthInput/selected.png" v-if="birth.gender==='1'">
					<img src="../../static/imgs/birthInput/noSelected.png" v-else>
				</label>
			</div>
		</div>
    <van-datetime-picker
    	v-model="currentDate"
    	type="datetime"
			:visible-item-count='3'
			:show-toolbar='false'
    	:min-date="minDate"
    	:max-date="maxDate"
    	:formatter="formatter"
			@change='getDate'
    />
  </div>
</template>
<script>
	import store from '@/utils/store';
	import {ToastMe} from './toastSelf.js'
	
  export default {
    props:['birthTime'],
    data(){
      return{
        birth:{ //生日输入model 对象
          name:'',
          gender:'0',
          calendar:'0',
          store:true
        },
				maxDate: new Date(),
				minDate: new Date(1900, 1, 1,3),
				currentDate:new Date(1990, 0, 1),
				timeShow:'1990年01月01日00时',
				timeArr:'1990-01-01 00'
      }
    },
		computed:{
			
		},
		mounted(){

		},
    methods:{
      birthSubmit(){ // 提交生日表单
        if(this.birth.name.length<1){
          this.$toast('姓名不能为空')
        }else{
					let time = this.timeArr
					let h =time.split(' ')[1]
					if(isNaN(h)){
						time = time.split(' ')[0]
					}else{
						time=time+':00:00'
					}
					if(this.timeArr=='1990-01-01 00'){
						this.$toast('请确保选择生日的准确性');
					}
					if(store.getStore('token')){ //正式账户
						this.$axios.post('/api/birthday/addBirthDay', {name:this.birth.name,
            sex:Number(this.birth.gender),birthtype:Number(this.birth.calendar),birthday:time }).then(res=>{
							if(res&&res.status===200){
								if(res.data.code===200){
									ToastMe('生日添加成功');
									this.$emit('birthHide')
								}else{
									this.$toast(res.data.msg)
								}
							}
						})
					}else{ //临时账户，保存本地
						store.setStore('birthday',time)
						store.setStore('birthtype',this.birth.calendar)
						store.setStore('birthNameTemp',this.birth.name)
						this.$toast('临时账户，生日已保存在本地')
						this.$emit('birthHide')
					} 
        }
      },
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`;
				} else if (type === 'month') {
					return `${value}月`
				} else if(type === 'day'){
					return `${value}日`
				}else if(type === 'hour'){
					return `${value}时`
				}
				return value;
			},
			getDate(v){
				let arrTime = v.getValues()
				arrTime.pop();
				this.timeArr = arrTime[0].substr(0,4)+'-'+arrTime[1].substr(0,2)+'-'+arrTime[2].substr(0,2)+' '+arrTime[3].substr(0,2);
				this.timeShow = arrTime.join('')
				
			},
			cancelBirthPop(){ //取消弹出框
			
				this.$emit('cancelBirthPop')
			}
    }
  }
</script>
<style lang="less">
	.van-picker-column__item--selected{color:#04396A}
  #birth_add{
		.top_box{
			position: relative;
			.top_btn{
      	position:absolute;
      	height:16%;
      	top:0;
      	img{
      		width:auto;
      		height:50%;
      		vertical-align: middle;
      		transform: translateY(45%);
      	}
      }
      .sure_btn{
      	right:3vw;
      	img{
      		height:58%;
      		transform: translateY(32%);
      	}
      }
      .cancel_btn{
      	left:3vw;
      }
			.birthname{
				position: absolute;
				top:22.3%;
				left:32%;
				height:36px;
				line-height: 36px;
				background: none;
				border:none;
				font-size: 16px;
			}
			.date_add{
				position: absolute;
				top:63.5%;
				left:30%;
			}
			.types{
				position: absolute;
				bottom:0;
				left:0;
				width:100%;
				height:15%;
				.radio_box{
					 display: none;
				}
				label{
					height:100%;
					display: inline-block;
					margin:0 5vw;
					position: relative;
					z-index: 5;
					img{
						width:auto;
						height:52%;
						transform: translateY(60%);
					}
					.bg{
						position:absolute;
						z-index:-1;
						top:-12px;
						left:-10px;
						bottom:-9px;
						right:-14px;
						
					}
				}
			}
			.gender{
				position: absolute;
				top:42.5%;
				left:33%;
				height:9%;
				.radio_box{
					display: none;
				}
				label{
					height:100%;
					display: inline-block;
					 margin-right:18vw;
					position: relative;
					z-index: 5;
					img{
						width:auto;
						height:100%;
						
					}
				
				}
			}
		}
    .title {
      text-align: center;
      font-size: 16px;
      margin: 6px 0;
    }
		.top_btn2{
			left:auto;
			right:12px;
		}
		.van-picker-column{font-size: 14px;}
    .box {
      margin: 9px 0;
      padding: 3px 15px;
      display: flex;
      position: relative;
      .label {
        max-width: 90px;
        flex: 1;
        vertical-align: middle;
        line-height: 1.8;
      }
      .van-radio-group {
        flex: 1;
        vertical-align: middle;
        .van-radio {
          display: inline-block;
          margin-right: 21px;
        }
      }
      .right {
        flex: 1;
        vertical-align: middle;
        .van-radio {
          margin-right: 8px;
          font-size: 13px;
          .van-radio__label {
            margin-left: 5px;
          }
        }
        .btn_time {
          position: absolute;
          right: -3px;
          top: 5px;
          font-size: 13px;
          color: #3385ff;
        }
      }
    }
    .submit {
      margin: 18px auto 0;
      width: 100px;
      line-height: 28px;
      height: 28px;
      background-color: #f39800;
			text-decoration: none;
			color:#fff;
      text-align: center;
      letter-spacing: 3px;
      border-radius: 3px;
    }
  }
</style>
