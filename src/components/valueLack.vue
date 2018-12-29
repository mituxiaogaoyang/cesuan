<template>
  <div id="value_lack">
    <div class="title">灵力值不足</div>
    <div class="info">
      您的灵力不足，是否前往兑换修行灵力值？
    </div>
    <div class="btns">
      <a @click="closePop">暂不</a>
      <a @click="exchange">兑换</a>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return{
      }
    },
    methods:{
      exchange(){ //兑换灵力
        this.$emit('openGet')
        //this.$emit('openLogin')
      },
      closePop(){
        this.$emit('closeLack')
      }
    }
  }
</script>
<style lang="less">
  #value_lack{
    background-color: #fff;
		box-shadow: 0 0 9px #ccc;
    padding:3vh 6vw;
    text-align: center;
    .title{
      font-size: 16px;
    }
    .info{
      margin:2vh 0;
    }
    .btns{
      display: flex;
      justify-content:space-between;
      a{
        width:30%;
        background-color: #f0f0f0;
        color:#333;
        height:32px;
        line-height: 32px;
        text-decoration: none;
      }
    }
  }
</style>
