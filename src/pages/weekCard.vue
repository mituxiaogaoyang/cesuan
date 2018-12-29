<template>
  <div id="week">
		<div class="mask" id='maskWeek'></div>
    <div class="content">
			<a class="back" @click="closeWeek"><img src="../../static/imgs/public/back.png" alt=""></a>
			<img src="../../static/imgs/week/bg_back.png" alt="">
			<div class="card">
				<img src="../../static/imgs/week/week_bg.png">
				<div class="card_content">
					<a class="list" v-for="(list,index) in dayList" @click='viewDetail(list.day,list.text,list.score,list.inuse)'>
						<div class="bg" v-if='list.isToday'><img src="../../static/imgs/week/list3.png" alt=""></div>
						<div class="bg" v-else-if='list.inuse'><img src="../../static/imgs/week/list.png" alt=""></div>
						<div class="bg" v-else><img src="../../static/imgs/week/list2.png" alt=""></div>
						<div class="lock" v-if='list.inuse&&list.buy===0'><img src="../../static/imgs/week/lock.png" alt=""></div>
						<div class="ray" v-if='checkbox.ray&&list.text&&list.text.length'><img src="../../static/imgs/week/ray.png"></div>
						<!-- <div class="line" :class="{red:parseInt(list.score)>-1}" :style="{bottom:10*(parseInt(list.score0)+2)+'%',transform:'rotate('+(parseInt(list.score0)-parseInt(list.score))*8+'deg)',width:100+Math.abs(parseInt(list.score0)-parseInt(list.score))*5+'%'}" v-if='list.inuse&&checkbox.trend'></div>
						<div class="line2" v-if='list.inuse&&checkbox.trend'></div> -->
						<div class="score" v-if='list.inuse&&checkbox.trend'><img :src="'../../static/imgs/week/star'+(parseInt(list.score)+3)+'.png'" alt=""></div>
						<div class="inner">
							<div class="month" v-show='index===0||list.isFirst'>{{ list.month | numberToChinese }}月</div>
							<div class="day">{{list.dayMe }}</div>
						</div>
					</a>
				</div>
			</div>
      <div class="bot">
				<div class="list">
					<div class="check">
						<img src="../../static/imgs/week/checkbox2.png" alt="" v-if='checkbox.trend'>
						<img src="../../static/imgs/week/checkbox.png" alt="" v-else>
						<input type="checkbox" id="trend" value="Jack" v-model="checkbox.trend">
					</div>
					<label for="trend">
						<img src="../../static/imgs/week/word1.png" alt="">
					</label>
				</div>
				<div class="list">
					<div class="check">
						<img src="../../static/imgs/week/checkbox2.png" alt="" v-if='checkbox.ray'>
						<img src="../../static/imgs/week/checkbox.png" alt="" v-else>
						<input type="checkbox" id="ray" value="Jack" v-model="checkbox.ray">
					</div>
					<label for="ray">
						<img src="../../static/imgs/week/word2.png" alt="">
					</label>
				</div>
			</div>
			<!-- <div class="future_btn" @click='buyFuture'>
				<img src="../../static/imgs/week/fortune_future.png">
			</div> -->
		</div>
    <van-popup v-model="panelDetail" class="detail_pop">
			<div class="detail_box">
				<div class="close" @click='panelDetail = false'><img src="../../static/imgs/week/close.png" alt=""></div>
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
		<!-- 提示框 -->
		<van-popup v-model="confirm.showIn1" class="detail_pop">
			<div class="date_confirm">
				<img src="../../static/imgs/public/confirm_bg.png" alt="">
				<div class="words">
					<div class="content">
						解锁{{current.day |timeCovert}}专业版运势需要消耗20灵力，是否查看？
					</div>
					<div class="confirm_btns">
						<a class="cancel" @click='confirm.showIn1=false'>取消</a>
						<a class="sure" @click='buyForturn(current.day)'>确定</a>
					</div>
						
				</div>
			</div>
		</van-popup>
		<van-popup v-model="confirm.showIn2" class="detail_pop">
			<div class="date_confirm">
				<img src="../../static/imgs/public/confirm_bg.png" alt="">
				<div class="words">
					<div class="content">
						<div class="alert_word">是否够买周卡解锁查看未来趋势？</div>
						<div class="time">当前有效期至：{{duration}}</div>
					</div>
					
					<div class="confirm_btns">
						<a class="cancel" @click='confirm.showIn2=false'>取消</a>
						<a class="sure" @click='buyForturn(current.day)'>确定</a>
					</div>
						
				</div>
			</div>
		</van-popup>
  </div>
</template>

<script>
	import store from  '../utils/store.js'
	import {ToastMe} from '../components/toastSelf.js' ;
	const arrChinese = ['一','二','三','四','五','六','七','八','九','十','十一','十二']
  export default {
    data() {
      return {
        dayList:[] , //isfirst:是否为当月第一个
				checkbox:{trend:true,ray:true},
				panelDetail:false,
				confirm:{showIn1:false,showIn2:false},
				current:{
					day:'',
					des:'',
					magicname:'',
					magicid:'',
					career:'',
					emotion:'',
					health:'',
					score:''
				},
				duration:'无'
      };
    },
    mounted(){
			this.getShowDays()
      //点击week 大弹框消失
      let week = document.querySelector('#maskWeek') 
      week.onclick = ()=>{
				
      	this.$emit('weekClose')
      }
    },
		computed:{
			status:function(){
				let word ;
				// debugger
				console.log(this.current.score)
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
			numberToChinese:(v)=> {
				return arrChinese[v-1]
			},
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
    methods: {
      viewWeek(){ //查询日历
				this.$axios.post('/api/calendar/getCalendar').then(res=>{
					if(res&&res.status===200) {
						if (res.data.code === 200) {
							console.log(res.data.calendar)
						}
					}
				})
			},
			closeWeek(){ //关闭日历
				this.$emit('weekClose')
			},
			getShowDays(){ //查询展示时间
				let arrMonth=[], arrDay=[];
				let date = new Date();
				let week = date.getDay();
				let month = date.getMonth()+1;
				let day = date.getDate();
				let year = date.getFullYear();
				let alldays = this.getMonthDays(year,month)  //本月总天数
				if(week===0){week=7}
				if(day-week+14>alldays){ //今日之后本月天数不够
					let i=1 , arr1 =[], arr2 = [] ;
					let  more = day-week+14 -alldays ; //第二个月要几天
					let  row1 =  day-week -6 ; //第一排开始值
					while(row1<alldays+1){
						let obj = {month:month,dayMe:row1,isFirst:false,isToday:false};
						if(row1 === day){
							obj.isToday = true
						}else{
							obj.isToday = false
						}
						arr1.push(obj);
						row1++;
					}
					if(month+1>12){
						month = month%12 
					}
					while(i<more+1){
							if(i===1){
								arr2.push({month:month+1,dayMe:i,isFirst:true});
							}else{
								arr2.push({month:month+1,dayMe:i,isFirst:false});
							}
							i++;
					}
					arrDay = arr1.concat(arr2)
				}else{ //今日之后本月天数足够
					if(day-week<8){ //今日之前天数不够
						let after=1 ,arr1 =[], arr2 = [] ;
						let alldayPrev = this.getMonthDays(year,month-1)  //上个月总天数(坑：month-1==0)
						let i = alldayPrev - 6 + day -week ; //上月开始的日子
						
						while(i<alldayPrev+1){
								arr1.push({month:month-1,dayMe:i,isFirst:false});
								i++;
						}
						while(after<day-week+15){
							let obj = {month:month,dayMe:after,isFirst:false,isToday:false};
							if(after === day){
								obj.isToday = true
								
							}else{
								obj.isToday = false
							}
							if(after === 1){
								obj.isFirst = true
							}else{
								obj.isFirst = false
							}
							arr2.push(obj);
							after++;
						}	
						arrDay = arr1.concat(arr2)
					}else{//今日之前本月天数足够
						let start = day-week - 6 ;
						let end = day-week+15 ;
						while(start<end){
							if(start===day){
								arrDay.push({month:month,dayMe:start,isFirst:false,isToday:true});
							}else{
								arrDay.push({month:month,dayMe:start,isFirst:false,isToday:false});
							}	
							start++;
						}	
					}
				}
				let _this = this 
				for(let i=0,len=arrDay.length;i<len;i++){
					if(arrDay[i].isToday){
						let p = new Promise(function(resolve,rej){
							_this.$axios.post('/api/calendar/getCalendar').then(res=>{
								if(res&&res.status===200) {
									if (res.data.code === 200) {
										resolve(res.data)
									}
								}
							})
						})
						p.then(function(data){
							for(let j=0,len=arrDay.length;j<len;j++){
								if(j<i-3||j>i+7){
									arrDay[j].inuse = false
								}else{
									arrDay[j].inuse = true
								}
							}
							
							for(let j=0,len=arrDay.length;j<len;j++){
								if(arrDay[j].inuse){
									for(let b=0,len=data.calendar.length;b<len;b++){
										
										if(b===0){
											data.calendar[len-1-b].score0 = data.oldscore 
										}else{
											data.calendar[len-1-b].score0 = data.calendar[len-b].score
										}
										Object.assign(arrDay[j+b], data.calendar[len-1-b]);
									}
									
									_this.dayList = arrDay
									return false
								}
							}
						})
						
					}
				}
				
				
				
			},
      getMonthDays(year,month){ //获取当前年月的总天数
				let date = new Date(year,month,0) ;
				return date.getDate();
			},
			buyFuture(){
				this.$axios.post('/api/calendar/getEndday').then(res=>{
					if(res&&res.status===200) {
						if (res.data.code === 200) {
							this.duration = res.data.endday.length?res.data.endday:'无'
							this.confirm.showIn2 = true ;
							this.current.day = '00'
						}else{
							ToastMe(res.data.err)
						}
					}
				})
				
			},
			viewDetail(day,text,score,inuse){ //日历详情
				this.current.day =day 
				this.current.text =text 
				this.current.score  = score ;
				if(inuse){
					this.$axios.post('/api/calendar/getCalendardes',{dayString:day,fulltext:text}).then(res=>{
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
								this.panelDetail = true
								
							}else if(res.data.code === 400){ //没购买
								this.buyForturn(day)
// 								let day1 = new Date().getDate();
// 								let day2 = Number(day.split('-')[2])
// 								if(day1>=day2||day2-day1>20){ //点击今天之前的时间
// 									this.confirm.showIn1 = true
// 								}else{
// 									this.duration = '无'
// 									this.confirm.showIn2 = true
// 								}
							
							}else if(res.data.code === 300){ //购买但过期了
								this.buyForturn(day)
// 								let day1 = new Date().getDate();
// 								let day2 = Number(day.split('-')[2])
// 								let dua = res.data.endday ;
// 								if(day1>=day2||day2-day1>20){ //点击今天之前的时间
// 									this.confirm.showIn1 = true
// 								}else{
// 									if(dua&&dua.indexOf('-')>0){
// 										this.duration = dua
// 									}else{
// 										this.duration = '无'
// 									}
// 									this.confirm.showIn2 = true
// 								}
							
							}else{
								ToastMe(res.data.err)
							}
						}
					})
				}else{
					return false;
				}
				
			},
			buyForturn(day){ //购买 
				if(day!='00'){
					this.$axios.post('/api/calendar/buyCalendar',{dayString:day}).then(res=>{
						if(res&&res.status===200) {
							if (res.data.code === 200) {
								this.confirm.showIn1 = false
								this.confirm.showIn2 = false
								this.viewDetail(day,this.current.text,this.current.score ,true);
								this.getShowDays()
							}else{
								ToastMe(res.data.err)
							}
						}
					})
				}else{
					this.$axios.post('/api/calendar/buyCalendar').then(res=>{
						if(res&&res.status===200) {
							if (res.data.code === 200) {
								this.getShowDays()
								this.confirm.showIn1 = false
								this.confirm.showIn2 = false
								ToastMe('自动续费成功')
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
  #week{
		color:#2f659a;
		min-height: 100%;
		img{display: block;width:100%}
		a{
			display: block;
			text-decoration: underline;
		}
		a:active{transform: scale(1.06);}
		.red{color:#ff0000;}
		.mask{
			position:absolute;
			top:0;
			bottom:0;
			left:0;
			right:0;
			z-index:2;
		}
		.content{
			// padding:2vh 2vw;
			position: absolute;
			top:50%;
			transform: translateY(-50%);
			left:0;
			z-index:3;
			width:100%;
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
			.card{
				position:absolute;
				top:21%;
				left:3%;
				width:94%;
				.card_content{
					position: absolute;
					top:16%;
					left:5.6%;
					width:90%;
					display: flex;
					justify-content:space-between;
					flex-wrap: wrap;
					// border:1px solid red;
					.list{
						width:14%;
						position:relative;
						display: block;
						margin-top:2%;
						.ray{
							position:absolute;
							bottom:5px;
							left:20%;
							width:50%;
							z-index:2;
						}
						.score{
							position: absolute;
							top:0;
							left:0;
							bottom:0;
							right:0;
						}
						.lock{
							position: absolute;
							top:2px;
							left:2px;
							width:30%;
						}
						.line{
							position: absolute;
							width:100%;
							height:2px;
							background:#008000;
							left: 0;
							z-index:5;
							bottom:0;
							transform-origin: left;
							&.red{
								background: #ff0000;
							}
						}
						.line2{
							position: absolute;
							width:100%;
							height:2px;
							z-index:2;
							background: #ccc;
							left: 0;
							bottom:20%;
						}
						.dot2{
							position: absolute;
							width:5px;
							height:5px;
							background: red;
							right: 0;
							border-radius: 50%;
							bottom:0;
						}
						.dot1{
							position: absolute;
							width:5px;
							height:5px;
							background: red;
							left: 0;
							border-radius: 50%;
							bottom:0;
						}
						.inner{
							position:absolute;
							top:0;
							z-index:3;
							width:100%;
							height:100%;
							text-align: center;
							left:0;
							.month{
								font-size: 12px;
								margin-top:7px;
							}
							.day{
								position:absolute;
								top:30%;
								left:0;
								width:100%;
								font-size: 14px;
							}
						}
					}
				}
			}
			.card_header{
				display: flex;
				justify-content:space-between;
				flex-wrap: nowrap;
			}
			.bot{
				position:absolute;
				bottom:6%;
				left:10%;
				width:80%;
				display: flex;
				justify-content:space-between;
				flex-wrap: nowrap;
				.list{
					width:30%;
					padding-left:9%;
					position:relative;
					input{
						position:absolute;
						top:0;
						left:0;
						right:0;
						bottom:0;
						opacity: 0;
					}
					label{
						display: block;
					}
					.check{
						position: absolute;
						top:-1%;
						bottom:-2%;
						left:0;
						img{
							height:100%;
							width:auto;
						}
					}
				}
			}
			.future_btn{
				width:60%;
				position:absolute;
				bottom:4%;
				left:20%;
			}
		}
		.detail_pop{
			width:100%;
		}
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
		.date_confirm{
			position:relative;
			width:80%;
			margin-left:10%;
			img{width:100%;display: block;}
			.words{
				position:absolute;
				top:37%;
				left:10%;
				width:80%;
				text-align: center;
				color:#485d70;
				font-size: 16px;
				transform: translateY(-50%);
				height:100%;
				.content{
					font-size: 16px;
					margin-bottom:16px ;
					.time{
						margin-top:28px
					}
				}
				.confirm_btns{
					position: absolute;
					bottom:-3px;
					left:0;
					width:100%;
					margin:0;
					a{
						float:left;
						&:last-child{
							float:right
						}
					}
				}
			}
		}
  }
</style>
