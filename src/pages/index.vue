<template>
  <div id="index">
    <div class="dot"></div>
		<div :class="[{bg2_peach:todayStatus.peach}, 'bg2']"></div>
    <router-link class="btn_set" :to="{name:'setting'}">
			<div class="birth_name">{{birthName}}</div>
			<img src="../../static/imgs/home/setting.png">
		</router-link>
    <a class="role" @click="fortuneView2" v-if='openMouse'><img src="../../static/imgs/home/juese2.gif"></a>
		<a class="role" @click="fortuneView2" v-else><img src="../../static/imgs/home/juese.gif"></a>
    <div class="desk"><img src="../../static/imgs/home/table.png" alt=""></div>
		<div class="cat2" v-if='todayStatus.wealth'><img src="../../static/imgs/home/cat_money.gif" alt=""></div>
		<div class="cat3"  v-else-if='todayStatus.motionless'><img src="../../static/imgs/home/sleepcat.gif" ></div>
		<div class="cat" v-else><img src="../../static/imgs/home/cat.png" alt=""></div>
		
    <div class="lamp"><img src="../../static/imgs/home/lamp.png" alt=""></div>
   <!-- <router-link class="tips" :to="{name:'tips'}" ><img src="../../static/imgs/home/xuetang.gif" alt=""></router-link> -->
		<a class="tips" @click="weekShow"><img src="../../static/imgs/home/xuetang.gif" alt=""></a>
    <a class="fortune_day" @click="selectDay"><img src="../../static/imgs/home/lapm.gif" alt=""></a>
    <a  class="sign" @click="toSign"><img src="../../static/imgs/home/fu.gif" alt=""></a>
    <a  class="portrait" @click="toPortrait"><img src="../../static/imgs/home/book.gif" alt=""></a>
    <div class="fortune_box" v-show="fortuneVisible">
			<a class="close" @click="fortuneVisible = false"><img src="../../static/imgs/week/close.png" alt=""></a>
      <div class="mask"></div>
      <div class="bg"><img src="../../static/imgs/home/pop_box.png" alt=""></div>
      <div class="content">
        <div v-show="fortunePage===1">
					<!-- <div class="cat_move" v-if='viewStatus.motionless'><img src="../../static/imgs/home/sleepcat.gif" alt=""></div> -->
					<div :class="[{reverse_cat:reverseCat},'cat_move','cat_left']" :style="{left:moveCatLeft+'px'}"  v-if='viewStatus.movement'><img src="../../static/imgs/home/movecat.gif" alt=""></div>
					<div class="flower" v-if='viewStatus.peach'  @click='fortuneVisible = false'><img src="../../static/imgs/home/flower.gif" alt=""></div>
          <div class="desc_yesterday" v-html='fortuneYesterday'></div>
          <div class="btn_box btn_three">
            <a @click="fortuneBefore" :class="{active:fortuneCurrent===0}">昨日运势</a>
            <a @click="fortuneToday" :class="{active:fortuneCurrent===1}">今日运势</a>
            <a @click="fortuneTomorrow" :class="{active:fortuneCurrent===2}">明日运势</a>
          </div>
        </div>
        <div v-show="fortunePage===2">
          <div class="words">是否扣除灵力查看明日运势？</div>
          <div class="btn_box yes_no">
            <a @click="valueReduce">是</a> <a  @click="fortunePage=1" >否</a>
          </div>
        </div>
        <div v-show="fortunePage===3">
          <div class="daypick_title">阁下所问何事？</div>
          <div class="day_types">
            <div class="list" v-for="type in dayTypes">
              <a @click="checkDay(type.id,type.name,type.active,type.content,type.info)" :class="{active:type.active}">{{type.name}}</a>
              <div class="time" v-if="type.active">{{type.content.targetDay}}</div>
            </div>
          </div>
        </div>
        <div v-show="fortunePage===4" @click='backTo' style='height:100%'>
          <div class="day_perfect" v-html="dayPerfect"></div>
        </div>
      </div>
    </div>
    <van-popup v-model="panel.birthAdd" class="form_pop" position="bottom">
      <birth-form @timePickerIn="panel.datePicker=true" @cancelBirthPop="panel.birthAdd=false"  @birthHide="addBirth"></birth-form>
    </van-popup>
    <van-popup v-model="panel.datePicker"  position="bottom">
      
    </van-popup>
    <van-popup v-model="panel.lack" class="value">
      <value-lack  @closeLack="panel.lack=false" @openLogin="panel.loginBox=true" @openGet='panel.valueGet=true'></value-lack>
    </van-popup>
    <van-popup v-model="panel.loginBox" class="form_pop">
      <login-box @closeLogin="loginIn"></login-box>
    </van-popup>
    <van-popup v-model="panel.valueGet" class="form_pop">
      <value-get @closeValue="panel.valueGet=false" @recharged='recharged'></value-get>
    </van-popup>
		<van-popup v-model="panel.weekCard" class="form_pop week_pop">
			<week-card @weekClose="panel.weekCard=false"></week-card>
		</van-popup>
		<van-popup v-model="confirm.showIn" class="form_pop">
			<div class="date_confirm">
				<img src="../../static/imgs/public/confirm_bg.png" alt="">
				<div class="words">
					<div class="confirm_title">{{confirm.title}}</div>
					<div class="confirm_content">{{confirm.content}}</div>
					<div class="confirm_btns">
						<a class="cancel" @click='confirm.showIn=false'>取消</a>
						<a class="sure" @click='sureViewDate'>确定</a>
					</div>
						
				</div>
			</div>
		</van-popup>
		<van-popup v-model="panel.todayDetail" class="today_pop">
			<div class="detail_box">
				<div class="close" @click='panel.todayDetail = false'><img src="../../static/imgs/week/close.png" alt=""></div>
				<div class="time">{{current.day|timeCovert}}</div>
				<div class="status" :class="[current.score>-1?'red':'green']">
					此日宜{{status}}
				</div>
				<div class="sign_about" v-if='Number(current.magicid)'>
					<div class="words_bold" v-html='current.des'></div>
					<div class="sign_box">
						<div class="img_bot"><img src="../../static/imgs/week/shine_outer.png" alt=""></div>
						<router-link class="sign_img"  :to="{name:'sign',query:{id:current.magicid}}">
							<div class="first"><img src="../../static/imgs/signs/lingfu-diban.png" alt=""></div>
							<div class="full"><img :src="'../../static/imgs/signs/steps/'+current.magicid+'/'+'0.png'"></div>
							<div class="full" v-if='current.progressnow'><img :src="'../../static/imgs/signs/steps/'+current.magicid+'/'+1+'.png'"></div>
							<div class="full" v-if='current.share' ><img :src="'../../static/imgs/signs/seal.png'"></div>
						</router-link>
						<div class="name">{{current.magicname}}</div>
					</div>
					
				</div>
				<div class="desc_box">
					<div class="list">
						<div class="title_word">事业</div>
						<div class="desc" v-html="current.career"></div>
					</div>
					<div class="list">
						<div class="title_word">情感</div>
						<div class="desc" v-html='current.emotion'></div>
					</div>
					<div class="list">
						<div class="title_word">健康</div>
						<div class="desc" v-html="current.health"></div>
					</div>
				</div>
			</div>
		</van-popup>
		<div class="pop_interval" v-show="panel.pop" @click="fortuneView2">
			<img src="../../static/imgs/home/pop.png" alt="">
			<div class="words">{{popWord}}</div>
		</div>
	</div>
</template>
<script>
import store from '@/utils/store';
import birthForm from '@/components/birthAdd.vue'
import ValueLack from '@/components/valueLack.vue'
import LoginBox from '@/components/login.vue'
import  valueGet from '@/components/valueGet.vue'
import  weekCard from '@/pages/weekCard.vue'
import {ToastMe} from '../components/toastSelf.js'
import router from '@/router'
export default {
  components:{birthForm, ValueLack, LoginBox, valueGet,weekCard},
  data () {
    return {
      panel:{
        birthAdd: false, //添加生日面板
        datePicker:false, //选择日期面板
        lack:false, // 灵力不足面板
        loginBox:false, //登录面板
        valueGet:false, //兑换灵力面板
				weekCard:false,
				todayDetail:false,
				pop:true,
      },
			popWord:'请告诉我你的生日。',
			openMouse:0,
			reverseCat:false,
			birthName:store.getStore('birthName')||store.getStore('birthNameTemp')||'未选择生日',
			todayStatus:{wealth:0,peach:0,motionless:0}, //今日运势点
			viewStatus:{movement:0, motionless:0,peach:0}, //所查看当日运势点
      timeSelected:'',
			moveCatLeft:-150,
      fortuneYesterday: '昨日运势低迷，陷阱重重，适宜远离工作环境，休养生息。', //当前运势文字（不一定是昨天）
      fortuneVisible:false, //弹出框
      fortunePage:1, //1：运势1 2：运势2  3：择日1  4：择日2
      fortuneCurrent:1, //当前显示的运势  0:昨天  1：今天  2：明天
			dayTypes:[
        {id:1,name:'桃花',info:'是否选出桃花运非常旺的日子？',active:false,content:{}},
        {id:2,name:'求财',info:'是否选出会有不错收获的日子？',active:false,content:{}},
        {id:3,name:'出行',info:'是否选出非常适宜外出的日子？',active:false,content:{}},
        {id:4,name:'投资',info:'是否选出非常适合投资的日子？',active:false,content:{}},
        {id:5,name:'合作',info:'是否选出非常适宜交友、缔约、会晤的日子？',active:false,content:{}}
      ],
			circle:'', //setInterval
      dayPerfect:'', //择日描述
			confirm:{
				showIn:false,
				id:1,
				title:'',
				content:'',
			},
			current:{score:''}
    }
  },
	computed:{
		status:function(){
			let word ;
			console.log(this.current.score)
			// debugger
			switch(this.current.score){
				case '-2': word = '处处小心' ;break ;
				case '-1': word ='韬光养晦' ;break ;
				case '0': word ='平平淡淡' ;break ;
				case '1': word ='小试牛刀';break ;
				case '2': word ='大展宏图';break ;
			}
			return word ;
		}
	},
	filters:{
		timeCovert:(time)=>{
			if(typeof time== 'undefined'){
				return ;
			}else if(time.indexOf('-')<0){
				return ;
			}else{
				let arr = time.split('-');
				return arr[0]+'年'+arr[1]+'月'+arr[2]+'日'
			}
			
		}
	},
  mounted(){
    //点无规则运动
    //this.dotMove(dot);
    //点击其他位置弹出框消失
    let body = document.querySelector('.mask')
    let _this = this
    body.addEventListener('click',function(){
      _this.fortuneVisible = false
    })
		
		//自动登录
		let  tokenTemp = window.tokenTemp//临时账户tokenTemp保存在window下
		let tokenLocal = store.getStore('token') || tokenTemp ;
		let datas =null ;
		if(tokenLocal){
			datas = {token:tokenLocal}
		}else{
			console.log('首次登陆')
		}
		this.$axios.post('/api/users/autoLogin',datas).then(res=>{
				if(res.data){
					if(res.data.code===200){
						if(res.data.userInfo.formal){
							store.setStore('token',res.data.token)
							store.setStore('nick',res.data.userInfo.name)
							store.setStore('mana',res.data.userInfo.mana)
							this.getBirthName()
							this.fortuneFirst();
							this.getPopArr()
						}else{
							window.tokenTemp = res.data.token ;
							store.setStore('nick',res.data.userInfo.name)
							store.setStore('mana',res.data.userInfo.mana)
							console.log('临时账号自动登陆成功');
							if(store.getStore('birthday')){ //存过生日
								this.$axios.post('/api/ganzhi/getDayFate',{birthtype:Number(store.getStore('birthtype')),birthday:store.getStore('birthday')}).then(res=>{
									if(res&&res.status===200){
										if(res.data.code===200){
											if(res.data.ret&&res.data.ret.todayText){
												let text = res.data.ret.todayText ;
												this.fortuneAll = res.data.ret ;
												this.fortuneYesterday =text.content;
												this.todayStatus.peach = Number(text.mainPeach)
												this.todayStatus.wealth = Number(text.wealth)
												this.todayStatus.motionless= Number(text.motionless)
												
												this.fortunePage =1 ;
												this.fortuneCurrent = 1;
											}
										}else{
											ToastMe(res.data.msg)
										}
									}
								})
							}
							this.getPopArr2()
						}
					}else if(res.data.code===500){
						store.deleteStore('token')
						ToastMe('账号已下线，请重新登录')
						this.panel.loginBox = true ;
					}else{
						ToastMe('登陆异常.')
					}
				}
			})
  },
	destroyed(){
		clearInterval(this.circle)
		clearInterval(this.circle2)
	},
  methods: {
    getFormatDate(date) { //转换日期格式
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
			var hour = "0" + date.getHours();
        var minute = "0" + date.getMinutes();
        var second = "0" + date.getSeconds();

      var currentDate = date.getFullYear() + "-" + month + "-" + strDate+ " " + hour.substring(hour.length-2, hour.length) + ":"
            + minute.substring(minute.length-2, minute.length) + ":"
            + second.substring(second.length-2, second.length);
			var currentDate2 = date.getFullYear() + "-" + month + "-" + strDate+ " "+date.getHours()+'时'
      return currentDate;
    },
		getPopArr(){
			this.$axios.post('/api/pop/getPop').then(res=>{
				if(res&&res.status===200){
					if(res.data.code===200){
						if(res.data.result.length){
							let intevalTime ;
							this.lenPop = 0
							this.arrPop = res.data.result
							this.popWord = this.arrPop[0]
							setTimeout(()=>{this.panel.pop = false;this.lenPop = 1},5000)
							this.circle2 = setInterval(this.popOut,13000)
						}else{
							this.panel.pop = false
						}
					}else if(res.data.code===501){
						this.lenPop = 0
						this.arrPop = ['请告诉我你的生日。']
						this.popWord = this.arrPop[0]
						setTimeout(()=>{this.panel.pop = false;this.lenPop = 0},5000)
						this.circle2 = setInterval(this.popOut,13000)
					}else{
						ToastMe(res.data.err||res.data.msg)
					}
				}
			})
		},
		getPopArr2(){ //未登录气泡文字
			let time = store.getStore('birthday')
			let type = store.getStore('birthtype')
			if(time){ //存过生日
				this.$axios.post('/api/pop/getPop',{birthday:time,birthtype:type}).then(res=>{
					if(res&&res.status===200){
						if(res.data.code===200){
							if(res.data.result.length){
								let intevalTime ;
								this.lenPop = 0
								this.arrPop = res.data.result
								this.popWord = this.arrPop[0]
								setTimeout(()=>{this.panel.pop = false;this.lenPop = 1},5000)
								this.circle2 = setInterval(this.popOut,13000)
							}else{
								this.panel.pop = false
							}
						}else{
							ToastMe(res.data.err||res.data.msg)
						}
					}
				})
			}else{
				this.lenPop = 0
				this.arrPop = ['请告诉我你的生日。']
				this.popWord = this.arrPop[0]
				setTimeout(()=>{this.panel.pop = false;this.lenPop = 0},5000)
				this.circle2 = setInterval(this.popOut,13000)
			}
		},
		popOut(){
			this.panel.pop = true 
			this.popWord = this.arrPop[this.lenPop]
			let t = this
			setTimeout(function(){
				if(t.lenPop<t.arrPop.length-1){
					t.lenPop++
				}else{
					t.lenPop = 0 
				}
				t.panel.pop = false
				
			},5000)
		},
		backTo(){
			this.selectDay()
		},
		toPortrait(){//跳转到自画像页面
			if(store.getStore('birthName')||store.getStore('birthNameTemp')){
				router.push({name:'portrait'})
			}else{
				this.panel.birthAdd = true
			}
			
		},
		toSign(){ 
			if(!store.getStore('token')){ //正式账户
				this.panel.loginBox = true
			}else if(!store.getStore('birthName')){
				this.panel.birthAdd = true
			}else{
				router.push({name:'sign'})
			}
		},
		addBirth(){
			if(store.getStore('token')){
				this.getBirthName()
				this.getPopArr()
			}else{
				this.birthName = store.getStore('birthNameTemp')
				this.getPopArr2()
			}
			this.panel.birthAdd=false ;
			this.fortuneFirst()
		},
		weekShow(){
			if(!store.getStore('token')){ //正式账户
				this.panel.loginBox = true
			}else if(!store.getStore('birthName')){
				this.panel.birthAdd = true
			}else{
				this.panel.weekCard=true
			}
			
		},
		getBirthName(){ //获取当前选中的生日 姓名
			this.$axios.post('/api/birthday/getUsingBirthDay').then(res=>{
				if(res&&res.status===200){
					if(res.data.code===200){
						if(res.data.result){
							this.birthName = res.data.result.name ;
							store.setStore('birthName',this.birthName)
							store.setStore('avatar',res.data.result.headPortrait)
						}else{
							this.birthName = '未选择生日'
							store.deleteStore('avatar')
							store.deleteStore('birthName')
						}
					}
				}
			})
		},
		recharged(v){
			this.value =v ;
			this.panel.lack = false
			this.panel.valueGet = false
		},
		fortuneFirst(){ //正式账号进入页面的请求
			if(store.getStore('token')){ //正式账户
				this.$axios.post('/api/ganzhi/getDayFate').then(res=>{
					if(res&&res.status===200){
						if(res.data.code===200){
							if(res.data.ret&&res.data.ret.todayText){
								let text = res.data.ret.todayText ;
								this.fortuneAll = res.data.ret ;
								this.fortuneYesterday =text.content.replace(/(#r#n)|(\n)/g,'</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
								this.todayStatus.peach = Number(text.mainPeach)
								this.todayStatus.wealth = Number(text.wealth)
								this.todayStatus.motionless= Number(text.motionless)
								this.fortunePage =1 ;
								this.fortuneCurrent = 1;
							}
						}else if(res.data.code===501){
							console.log(res.data.msg)
						}else{
							ToastMe(res.data.msg)
						}
					}
				})
			}else{
				if(store.getStore('birthday')){ //存过生日
					this.$axios.post('/api/ganzhi/getDayFate',{birthtype:Number(store.getStore('birthtype')),birthday:store.getStore('birthday')}).then(res=>{
						if(res&&res.status===200){
							if(res.data.code===200){
								if(res.data.ret&&res.data.ret.todayText){
									let text = res.data.ret.todayText ;
									this.fortuneAll = res.data.ret ;
									this.fortuneYesterday =text.content.replace(/(#r#n)|(\n)/g,'</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
									this.todayStatus.peach = Number(text.mainPeach)
									this.todayStatus.wealth = Number(text.wealth)
									this.todayStatus.motionless= Number(text.motionless)
									this.fortunePage =1 ;
									this.fortuneCurrent = 1;
									
								}
							}
						}
					})
				}
			}
		},
		catMove(){
			if(this.viewStatus.movement){
				clearInterval(this.circle)
				this.moveCatLeft = -190 ;
				let w = window.innerWidth ;
				let flag = true ;
				this.circle =setInterval(()=>{	
					if(this.moveCatLeft>w){
						flag =false ;	
					}else if(this.moveCatLeft<-190){
						flag = true ;
					}
					if(flag){
						this.reverseCat = false
						this.moveCatLeft++
					}else{
						this.reverseCat = true
						this.moveCatLeft--
					}
					
					},5)
			}
		},
    fortuneView(){ //运势查看
			this.openMouse =1;
			setTimeout(()=>{this.openMouse =0;},1000)
      if(this.fortuneAll&&this.fortuneAll.todayText){ //是否请求过
        let text = this.fortuneAll.todayText ;
        this.fortuneYesterday =text.content.replace(/(#r#n)|(\n)/g,'</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
				this.viewStatus.peach = Number(text.dialoguePeach)
				this.viewStatus.motionless = Number(text.motionless)
				this.viewStatus.movement = Number(text.movement)
        this.fortunePage =1 ;
        this.fortuneCurrent = 1;
        this.fortuneVisible  =true;
				if(this.viewStatus.peach){
					setTimeout(()=>{this.viewStatus.peach = 0},7000)
				}
				this.catMove()
      }else{
				if(store.getStore('token')){ //正式账户
					this.$axios.post('/api/ganzhi/getDayFate').then(res=>{
						if(res&&res.status===200){
							if(res.data.code===200){
								if(res.data.ret&&res.data.ret.todayText){
									let text = res.data.ret.todayText ;
									this.fortuneAll = res.data.ret ;
									this.fortuneYesterday =text.content.replace(/(#r#n)|(\n)/g,'</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
									this.viewStatus.peach = Number(text.dialoguePeach)
									this.viewStatus.motionless = Number(text.motionless)
									this.viewStatus.movement = Number(text.movement)
									this.fortunePage =1 ;
									this.fortuneCurrent = 1;
									this.fortuneVisible  =true
								}
							}else if(res.data.code===501){
								this.panel.birthAdd = true
							}else if(res.data.code ===500){
								ToastMe(res.data.msg)
							}else if(res.data.code ===101){
								window.location.reload()
							}
						}
					})
				}else{ //非正式账户
					if(store.getStore('birthday')){ //存过生日
						this.$axios.post('/api/ganzhi/getDayFate',{birthtype:Number(store.getStore('birthtype')),birthday:store.getStore('birthday')}).then(res=>{
							if(res&&res.status===200){
								if(res.data.code===200){
									if(res.data.ret&&res.data.ret.todayText){
										let text = res.data.ret.todayText ;
										this.fortuneAll = res.data.ret ;
										this.fortuneYesterday =text.content.replace(/(#r#n)|(\n)/g,'</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
										this.viewStatus.peach = Number(text.dialoguePeach)
										this.viewStatus.motionless = Number(text.motionless)
										this.viewStatus.movement = Number(text.movement)
										this.fortunePage =1 ;
										this.fortuneCurrent = 1;
										this.fortuneVisible  =true
									}
								}else if(res.data.code===501){
									this.panel.birthAdd = true
								}else if(res.data.code ===500){
									ToastMe(res.data.msg)
								}
							}
						})
					}else{
						this.panel.birthAdd = true
					}
					
				}
        
      }
    },
    fortuneView2(){
			this.openMouse =1;
			setTimeout(()=>{this.openMouse =0;},1000)
			if(store.getStore('token')){ //正式账户
				this.$axios.post('/api/calendar/getCalendarToday').then(res=>{
					if(res&&res.status===200) {
						if (res.data.code === 200) {
							let day = res.data.calendar[0].day ;
							let text = res.data.calendar[0].text ;
							this.current.day =day 
							this.current.text =text 
							this.current.score  = res.data.calendar[0].score 
							this.$axios.post('/api/calendar/getCalendarDesToday',{dayString:day,fulltext:text}).then(res=>{
								if(res&&res.status===200) {
									if (res.data.code === 200) {
										let obj = res.data ,t =this ;
										for(let key in obj){
											if(key=='career'||key=='emotion'||key=='health'||key=='des'){
												t.current[key] = obj[key].replace(/(#r#n)|(\n)/g,'</br>');
											}else{
												t.current[key] = obj[key] ;
											}
										}
										this.panel.todayDetail =true
									}else{
										ToastMe(res.data.msg||res.data.err)
									}
								}
							})
						}else if(res.data.code === 501){
							this.panel.birthAdd = true
						}else if(res.data.code === 101){
							window.location.reload()
						}else{
							ToastMe(res.data.msg||res.data.err)
						}
					}
				})
			}else{ //临时账户
				if(store.getStore('birthday')){ //存过生日
					let birthday =store.getStore('birthday').split(' ')[0]
					let type = Number(store.getStore('birthtype'))
					this.$axios.post('/api/calendar/getCalendarToday',{birthday:birthday,birthtype:type}).then(res=>{
						if(res&&res.status===200) {
							if (res.data.code === 200) {
								let day = res.data.calendar[0].day ;
								let text = res.data.calendar[0].text ;
								this.current.day =day 
								this.current.text =text 
								this.current.score  = res.data.calendar[0].score 
								this.$axios.post('/api/calendar/getCalendarDesToday',{dayString:day,fulltext:text,birthday:birthday,birthtype:type}).then(res=>{
									if(res&&res.status===200) {
										if (res.data.code === 200) {
											let obj = res.data ,t =this ;
											for(let key in obj){
												if(key=='career'||key=='emotion'||key=='health'||key=='des'){
													t.current[key] = obj[key].replace(/(#r#n)|(\n)/g,'</br>');
												}else{
													t.current[key] = obj[key] ;
												}
											}
											this.panel.todayDetail =true
										}else{
											ToastMe(res.data.msg||res.data.err)
										}
									}
								})
							}else if(res.data.code === 501){
								this.panel.birthAdd = true
							}else if(res.data.code === 101){
								window.location.reload()
							}else{
								ToastMe(res.data.msg||res.data.err)
							}
						}
					})
				}else{
					this.panel.birthAdd = true
				}
			}
		},
		loginIn(){
      this.panel.loginBox = false ;
      this.panel.lack = false ;
			this.getBirthName()
    },
//     selectDay(){ // 择日
// 			if(store.getStore('token')){//正式账户
// 				this.$axios.post('/api/zheri/getallzheri').then(res=>{
// 					if(res&&res.status===200){
// 						if(res.data.code===200){
// 							this.fortunePage =3 ;
// 							for(let k in res.data.result){
// 								for(let a=1,len=this.dayTypes.length+1;a<len;a++ ){
// 									if(Number(k) === a){
// 										this.dayTypes[a-1].active = true ;
// 										this.dayTypes[a-1].content = res.data.result[k]
// 									}
// 								}
// 							}
// 							this.fortuneVisible  =true
// 						}else if(res.data.code===501){
// 							this.panel.birthAdd = true
// 						}else{
// 							ToastMe('服务异常')
// 						}
// 					}
// 				})
// 			}else{
// 				if(store.getStore('birthday')){ //存过生日
// 					this.$axios.post('/api/zheri/getallzheri',{birthtype:Number(store.getStore('birthtype')),birthday:store.getStore('birthday')}).then(res=>{
// 						if(res&&res.status===200){
// 							if(res.data.code===200){
// 								this.fortunePage =3 ;
// 								for(let k in res.data.result){
// 									for(let a=1,len=this.dayTypes.length+1;a<len;a++ ){
// 										if(Number(k) === a){
// 											this.dayTypes[a-1].active = true ;
// 											this.dayTypes[a-1].content = res.data.result[k]
// 										}
// 									}
// 								}
// 								this.fortuneVisible  =true
// 							}else if(res.data.code===501){
// 								this.panel.birthAdd = true
// 							}else{
// 								ToastMe('服务异常')
// 							}
// 						}
// 					})
// 				}else{
// 					this.panel.birthAdd = true
// 				}
// 			}
//       
//     },
		selectDay(){ // 择日
			if(!store.getStore('token')){ //正式账户
				this.panel.loginBox = true
			}else if(!store.getStore('birthName')){
				this.panel.birthAdd = true
			}else{
				this.$axios.post('/api/zheri/getallzheri').then(res=>{
					if(res&&res.status===200){
						if(res.data.code===200){
							this.fortunePage =3 ;
							for(let k in res.data.result){
								for(let a=1,len=this.dayTypes.length+1;a<len;a++ ){
									if(Number(k) === a){
										this.dayTypes[a-1].active = true ;
										this.dayTypes[a-1].content = res.data.result[k]
									}
								}
							}
							this.fortuneVisible  =true
						}else if(res.data.code===501){
							this.panel.birthAdd = true
						}else if(res.data.code===101){
							window.location.reload()
						}else{
							ToastMe('服务异常')
						}
					}
				})
			}
		},
    getDate(v){ //获取选择时间
      let time = this.getFormatDate(v)
      this.timeSelected = time ;
      this.panel.datePicker =false
    },
    viewMana(){ // 灵力查看
      this.$axios.post('/api/mana/getMana').then(res=>{
        if(res&&res.status===200){
          if(res.data.code===200){
            this.value = res.data.mana
          }
        }
      })
    },
    fortuneToday(){ //今日运势
      if(this.fortuneAll&&this.fortuneAll.todayText){ //是否请求过
        let text = this.fortuneAll.todayText;
        this.fortuneYesterday =text.content.replace(/(#r#n)|(\n)/g,'</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
        this.viewStatus.peach = Number(text.dialoguePeach)
        this.viewStatus.motionless = Number(text.motionless)
        this.viewStatus.movement = Number(text.movement)
        this.fortuneCurrent = 1;
				this.catMove()
      }
    },
    fortuneBefore(){ //昨日运势
      if(this.fortuneAll&&this.fortuneAll.yesterdayText){ //是否请求过
        let text = this.fortuneAll.yesterdayText ;
        this.fortuneYesterday =text.content.replace(/(#r#n)|(\n)/g,'</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
        this.viewStatus.peach = Number(text.dialoguePeach)
        this.viewStatus.motionless = Number(text.motionless)
        this.viewStatus.movement = Number(text.movement)
        this.fortuneCurrent = 0;
				this.catMove()
      }
    },
    fortuneTomorrow(){//明日运势
			if(store.getStore('token')){
				if(this.fortuneAll){
					if(this.fortuneAll.tomorrowBuy===0){
						//this.fortunePage = 2
						this.valueReduce()
					}else{
						let text = this.fortuneAll.tomorrowText ;
						this.fortuneYesterday =text.content.replace(/(#r#n)|(\n)/g,'</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
						this.viewStatus.peach = Number(text.dialoguePeach)
						this.viewStatus.motionless = Number(text.motionless)
						this.viewStatus.movement = Number(text.movement)
						this.fortuneCurrent = 2;
						this.catMove()
					} 
				}
			}else{
				ToastMe('暂时没有权限，登陆后可查看')
			}
    },
    valueReduce(){
			this.$axios.post('/api/ganzhi/buytomorrow').then(res=>{
			if(res&&res.status===200){
				if(res.data.code===200){
					this.value = res.data.mana
					store.setStore('mana',res.data.mana)
					ToastMe('灵力已扣除，剩余灵力'+res.data.mana)
					this.$axios.post('/api/ganzhi/getDayFate').then(res=>{ //重新请求运势
					if(res&&res.status===200){
						if(res.data.code===200){
						if(res.data.ret&&res.data.ret.tomorrowText){
							let text = res.data.ret.tomorrowText;
							this.fortuneAll = res.data.ret ;
							this.fortuneYesterday =text.content.replace(/(#r#n)|(\n)/g,'</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
							this.viewStatus.peach = Number(text.dialoguePeach)
							this.viewStatus.motionless = Number(text.motionless)
							this.viewStatus.movement = Number(text.movement)
							this.fortunePage =1 ;
							this.fortuneCurrent = 2;
							this.catMove()
						}
						}else {
							ToastMe(res.data.msg)
						}
					}
					})
				}else if(res.data.code===500){
					ToastMe('灵力不足。可通过每日登陆获取，也可以进行灵力兑换。')
					//this.panel.lack =true
				}else{
					ToastMe(res.data.err)
				}
			}
			})	
    },
		toastSelf(word){
			this.toastIn = true ;
			this.wordsToast = word ;
			setTimeout(()=>{this.toastIn = false},2000)
		},
    checkDay(id,name,bool,obj,info){ //择日
			if(bool){
				this.fortunePage =4 ;
				this.dayPerfect =`<span class="red">${obj.targetDay}</span>，${this.convert(obj.content)}`;
			}else{
				this.confirm.title = name ;
				this.confirm.content = info ;
				this.confirm.id = id ;
				this.confirm.showIn = true ;
			}
			
    },
		sureViewDate(){
			this.$axios.post('/api/zheri/getzheri',{type:this.confirm.id}).then(res=>{
				if(res&&res.status===200){
					if(res.data.code===200){
						this.confirm.showIn = false;
						this.fortunePage =4 ;
						if(res.data.result){
							let content = res.data.result.content;
							this.dayPerfect =`<span class="red">${res.data.result.targetDay}</span>，${this.convert(content)}`;
							
						}else{
							ToastMe('暂无内容,稍后查看')
						}
					}else if(res.data.code===501){
						ToastMe('暂时没有权限，登陆后可查看')
					}else if(res.data.code===500){
						ToastMe('灵力不足。可通过每日登陆获取，也可以进行灵力兑换。')
						//this.panel.lack =true
					}else{
						ToastMe(res.data.msg)
					}
				}
			})
		},
		convert(str){ // #转代码
		 let computed = str.replace(/\#([a-zA-Z0-9_\u4e00-\u9fa5]+)\#/g,function (match,key) {
			 return '<span class="blue">'+key+'</span>';
		 })
		 return computed;
		},
    dotMove(dom){
      const maxB =500, maxL = 250,
          initB = 250,initL = 60,h = window.innerHeight;
      var offsetX=8, offsetY=5;
      console.log(h+''+dom.offsetTop)
      setInterval(function(){
        var left = dom.offsetLeft + offsetX,
            bottom = h- dom.offsetTop-20 + offsetY ;
        if(left>=maxL){
          left = maxL ;
          offsetX = - offsetX
        }else if(left<=initL){
          left = initL ;
          offsetX = - offsetX
        }
        if(bottom>=maxB){
          bottom = maxB ;
          offsetY = -offsetY
        }else if(bottom<=initB){
          bottom = initB
          offsetY = -offsetY
        }
        dom.style.left = left+'px' ;
        dom.style.bottom = bottom+'px' ;
      },30)

    }
  }
};
</script>

<style lang="less">
body {
  background-color: #fff;
  -webkit-font-smoothing: antialiased;
  font-family: PingFang SC, Helvetica Neue, Arial, sans-serif;
  margin:0;
}

.van-picker-column:nth-child(5){display: none}
.van-popup.value{width:66%;}
.van-dialog__message{text-align: center;}
#index{
  height:100vh;
  width:100%;
  overflow: hidden;
  background:#fff url(../../static/imgs/home/bg1.png) center bottom fixed no-repeat;
  background-size:cover;
  position: relative;
  img{display: block;width:100%}
  a{
    display: block;
    color:#327573;
		font-size: 16px;
    text-decoration: underline;
    &.alert{
      color:#fd917d
    }
  }
  a:active{transform: scale(1.1);}
	.bg2{
		height:100vh;
		width:100%;
		overflow: hidden;
		background:  url(../../static/imgs/home/bg2.png) center bottom fixed no-repeat;
		background-size:cover;
		position: absolute;
		top:0;
		left:0;
		z-index:1;
	}
	.bg2_peach{
		background-image:  url(../../static/imgs/home/bg22.png)
	}
  .value_box{
    position: absolute;
    top:1vh;
    left:2vw;
    color:#fd917d;
    font-size: 16px;
    span{vertical-align: middle}
    .value{
      font-weight: bold;
      font-size: 18px;
    }
  }
	.pop_interval{
		position: absolute;
		z-index:2;
		bottom:420px;
		right:37vw;
		width:60vw;
		color:#2a4764;
		font-size: 16px;
		.words{
			position:absolute;
			width:80%;
			left:10%;
			top:50%;
			transform: translateY(-50%);
		}
	}
  .role{
    position: absolute;
    z-index:2;
    bottom:90px;
    right:5vw;
    width:50vw;
  }
  .desk{
    position: absolute;
    z-index:3;
    bottom:6px;
    left:10vw;
    width:88vw;
  }
  .portrait{
    position: absolute;
    z-index:6;
    bottom:96px;
    left:52vw;
    width:32vw;
    &:active{
      transform:  scale(1.1);
    }
  }
  .cat{
    position: absolute;
    z-index:5;
    bottom:146px;
		left:15vw;
		width:27vw;
  }
	.cat2{
		position: absolute;
		z-index:5;
		bottom:10px;
		left:1vw;
		width:32vw;
	}
	.cat3{
		position: absolute;
		z-index:5;
		bottom:356px;
		left:11.3vw;
		width:24vw;
	}
  .lamp{
    position: absolute;
    z-index:5;
    bottom:30px;
    right:4vw;
    width:20vw;
  }
  .tips{
    position: absolute;
    z-index:3;
    bottom:245px;
    left:4vw;
    width:39vw;
  }
  .fortune_day{
    position: absolute;
    z-index:6;
    bottom:175px;
    right:4vw;
    width:30vw;
  }
  .form_pop{width:100%;}
	.week_pop{height:100%}
  .sign{
    position: absolute;
    z-index:4;
    bottom:44px;
    left:7.5vw;
    width:56vw;
    &:active{
      transform:scale(1.1);
    }
  }
  .btn_set{
    position: absolute;
    z-index:5;
    top:1vh;
    right:2vw;
    width:36vw;
		.birth_name{
			position:absolute;
			left:4.2vw;
			top:50%;
			width:24vw;
			text-align: center;
			color:#000;
			font-size: 14px;
			transform: translateY(-50%);
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

  }
	.date_confirm{
 		position:relative;
		width:80%;
		margin-left:10%;
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
			.confirm_title{
				font-size: 16px;
				margin-bottom:16px ;
			}
			.confirm_content{
				margin:16px 0;
			}
			.confirm_btns{
				margin:27px 6vw 0;
				a{
					float:left;
					&:last-child{
						float:right
					}
				}
			}
		}
	}
  .fortune_box{
    position: absolute;
    bottom:70px;
    left:9%;
    z-index:6;
    width:82%;
    box-sizing: border-box;
		color:#275079;
		.close{
			position:absolute;
			right:2vw;
			top:8px;
			width:8vw;
			z-index:9;
		}
    .mask{
      position: fixed;
      top:0;
      left:0;
      right:0;
      bottom:0;
      z-index:-1;
      opacity: 0;
      background-color: rgba(0,0,0,0);
    }
    .content{
			position:absolute;
			top:0;
			left:0;
			right:0;
			bottom:0;
			padding:3vh 6vw;
			.cat_move{
				position: absolute;
				top:-9.3vh;
				left:0;
				height:12vh;
				img{
					width:auto;
					height:100%;
				}
			}
			.desc_yesterday{text-indent: 2em;font-size: 15px;position:absolute;top:40%;transform: translateY(-50%);width:90%;left:5%;line-height: 1.5;}
			.reverse_cat{transform: rotateY(180deg);}
			.cat_left{left:-190px;top:-13vh;height:18vh}
			.flower{
				position: absolute;
				top:-20vh;
				left:-15%;
				width:120%;
			}
      .words{
        text-align: center;
        padding:50px 0 15px;
				font-size:20px;
				
      }
      
    }
    .btn_box{
			 position: absolute;
			 bottom:3vh;
			 left:0;
			 right:0;
			 padding:0 8vw;
			 &.yes_no{
				 padding:0 20vw;
				 bottom:9vh;
				 a{font-size: 20px;}
				 
				 a:first-child{
						float:left;
					}
					a:last-child{
						float:right
					}
			 }
			 &.btn_three{
				 a{
					 width:33.3%;
					 float:left;
					 text-align: center;
				 }
			 }
			 a{
				 color:#7992b0;
				 display: inline-block;
				 &.active{
					 color:#b079ae
				 }
			 }
      
      &:after{
        content:'';
        display: block;
        clear:both
      }
    }
    .bg{
//       position: absolute;
//       right:-9px;
//       left:-9px;
//       top:0;
//       z-index:-1;
//       bottom:0;
    }
    .daypick_title{
      margin:5px 0 20px;
      
			text-align: center;
			font-size: 18px;
    }
    .day_types{
      display: flex;
      justify-content:space-between;
      text-align: center;
      flex-wrap:wrap;
			position: relative;
      .list{
        width:39%;
        padding:1vh 0 3vh;
        position: relative;
				margin-bottom: 7vh;
				&:last-child{
					position:absolute;
					top:25%;
					left:30%;
				}
        a{
          color:#4a7195;
					font-size:20px;
          &.active{color:#009fff;}
        }
        .time{
          position: absolute;
          bottom:0.6vh;
          color:#009fff;
          min-width: 100px;
          font-size: 13px;
          left:0;
          width:100%;
        }
      }

    }
    .day_perfect{
			font-size: 20px;
			position:absolute;
			top:48%;
			left:0;
			transform: translateY(-50%);
			padding: 3vh 6vw; 
			text-indent: 2em;
    }
  }
  .dot{
    position: absolute;
    bottom:250px;
    left:60px;
    width:2px;
    height:2px;
    border-radius: 50%;
    background-color: red;
    z-index:3;
  }
	.today_pop{width:100%}
	.detail_box{
			width:88%;
			margin:0 auto;
			padding:0 6vw;
			box-sizing: border-box;
			background: rgba(255,255,255,.9);
			border:3px solid #8298d3;
			border-radius: 15px;
			color:#4d7494;
			.close{
				position:absolute;
				right:9vw;
				top:12px;
				width:8vw;
			}
			.time{
				text-align: center;
				margin:2vh 0 1vh;
				font-size: 18px;
			}
			.status{
				text-align: center;
				font-size: 17px;
				
				&.red{
					color:#ff0000;
				}
				&.green{
					color:#008000;
				}
			}
			.sign_about{
				position: relative;
				margin:2vh 0;
				.words_bold{
					position:absolute;
					top:50%;
					left:0;
					width:56%;
					transform: translateY(-50%);
					font-size: 18px;
					color:#000;
					font-weight: bold;
				}
				.sign_box{
					margin-left:68%;
					width:25%;
					position: relative;
					.name{
						position: absolute;
						top:50%;
						transform: translateY(-50%) ;
						right:-8vw;
						width:20px;
						color:#144771;
					}
					.img_bot{
						position: absolute;
						top:-12%;
						width:160%;
						left:-30%;
					}
					.sign_img{
						position: relative;
						display: block;
						.full{
							position: absolute;
							top:0;
							left: 0;
							width:100%;;
						}
					}
				}
			}
			.desc_box{
				.list{
					margin:2vh 0;
					.title_word{
						text-align: center;
						font-size: 16px;
						color:#144771;
						margin-bottom: 3px;
					}
				}
				
			}
		}
}
</style>
