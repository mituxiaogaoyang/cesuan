<template>
  <div id="tips">
		<div class="top">
			<router-link :to="{name:'index'}" class="back"><img src="../../static/imgs/public/home.png" ></router-link>
			<div class="title"><img src="../../static/imgs/tips/title.png" ></div>
		</div>
    <div class="content">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="list" v-for="(list,index) in tips">
          <a class="question" @click="changeStatus(index)">
						<img src="../../static/imgs/tips/listBg.png">
						<div class="words">{{list.title}}</div>
					</a>
          <div class="answer" v-show="list.collapse">
            <div class="words" v-html="list.content"></div>
            <a  class="btn_share" @click="share">分享</a>
          </div>
        </div>
        <div class="tomorrow">
					<img src="../../static/imgs/tips/tomorrowBg.png">
          <div class="words">明日预告:{{tomorrowTittle}}</div>
        </div>
      </van-pull-refresh>
    </div>
		
  </div>
</template>

<script>
	import store from  '../utils/store.js'
	import {ToastMe} from '../components/toastSelf.js'
  export default {
    data() {
      return {
        tips:[
          { q:'炼金术是种心理学？',
            a:'是的。',
            collapse:true
          },
          { q:'难道我不是处女座？',
            a:'你是否觉得星座的解读和自己相差甚远？我们经常说的星座是太阳星座，而每个人的特质是由多个行星来表现的。',
            collapse:false
          },
        ],
        tomorrowTittle:'民以食为天',
        isLoading:false,
        nextOrder:1
      };
    },
    mounted(){
      this.getTipsFirst();
			this.getTomorrow();
    },
    methods: {
      onRefresh(){ //下拉刷新
        let order = this.nextOrder;
        let _t = this
        if(order==0){
          setTimeout(function () {
            ToastMe('没更多数据了')
            _t.isLoading = false;
          },100)

        }else{
          this.$axios.post('/api/daily/getdailyStudy',{size:5,orderNo:order}).then(res=>{
            if(res&&res.status===200) {
              if (res.data.code === 200) {
                if(res.data.data){
                  this.isLoading = false;
									let list = res.data.data.list
									for(let i =0;i<list.length;i++){
										list[i].collapse = false
										list[i].content =(list[i].content).replace(/(#r#n#r#n)|(\n)/g,'<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
									}
                  this.tips =this.tips.concat(list) 
									
                  this.nextOrder = res.data.data.orderNo
                }
              }
            }
          })
        }
      },
      getTipsFirst(){
        this.$axios.post('/api/daily/getdailyStudy',{size:5}).then(res=>{
            if(res&&res.status===200) {
              if (res.data.code === 200) {
                if(res.data.data){
									let list = res.data.data.list 
									
									for(let i =0;i<list.length;i++){
										if(list[i].today===1){
											list[i].collapse = true
										}else{
											list[i].collapse = false
										}
										
										list[i].content =(list[i].content).replace(/(#r#n#r#n)|(\n)/g,'<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
									}
									this.tips = list
                  this.nextOrder = res.data.data.orderNo
                }

              }
            }
          })
      },
			getTomorrow(){
				this.$axios.post('/api/daily/getnextStudy').then(res=>{
					if(res&&res.status===200) {
						if (res.data.code === 200) {
							if(res.data.data){
								this.tomorrowTittle = res.data.data.title
							}else{
								this.tomorrowTittle = '没有更多了'
							}
						}
					}
				})
			},
      changeStatus (i,obj){ //更改折叠状态
        //obj.collapse = !this.tips[index].collapse
				this.tips[i].collapse = !this.tips[i].collapse
      },
      share(){
        //store.setStore('a','adf')
        store.deleteStore('a')
      },
			convert(str){ // #转代码
				let str2  ='#r#n' +str +'#r#n' ;
				let computed = str2.replace(/(#r#n)([a-zA-Z0-9_\u4e00-\u9fa5]+)(#r#n)/g,function (match,key) {
					return '<p>'+key+'</p>';
				})
				return computed;
			}
    }
  };
</script>

<style lang="less">
  #tips{
		color:#275079;
    img{display: block;width:100%}
    min-height: 100vh;
    a{
      display: block;
      text-decoration: underline;
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
    .content{
      padding:12vh 6vw 5vh;
      line-height: 1.6;
      .van-pull-refresh__track{min-height:80vh}
      .list{
        margin-top:1vh;
        .question{
          position: relative;
					margin:12px 0;
					.words{
						position:absolute;
						top:50%;
						transform: translateY(-50%);
						left:4.5vw;
						font-size: 18px;
					}
        }
        .answer{
          margin-top:1vh;
          background-color:rgba(255,255,255,.9);
          padding:0.6vh  2.5vw;
          border:2px solid #8bb7df;
          box-shadow: 0 0 3px #999;
          border-radius:15px;
          text-indent: 2em;
          text-align: center;
          .words{text-align: left}
          .btn_share{
            display: inline-block;
            margin-top:3.6vh;

          }
        }
      }
      .tomorrow{
				margin:12px 0;
        position: relative;
        .words{
        	position:absolute;
        	top:50%;
        	transform: translateY(-50%);
        	left:4.5vw;
        	font-size: 18px;
        }
      }
    }
  }
</style>
