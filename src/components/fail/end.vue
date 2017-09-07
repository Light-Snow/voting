<template>
  <div class="activityEnd">
    <img src="../../assets/images/end.png" alt="">
    <!--<a v-show="subscribe === 'false'" href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzUzNTE4MTE0Mw==&scene=110" class="care">关注</a>-->
    <!--<span v-show="subscribe === 'true'"  class="care">已关注</span>-->
  </div>
</template>

<script>
  import commonApi from 'common/js/http'
  export default {
    name: 'activityEnd',
    data () {
      return {
        msg: '活动结束',
        subscribe: '' // 是否关注
      }
    },
    mounted() {
//      this.getOpenId()
    },
    computed: {
    },
    methods: {
      getOpenId() {
        const params = {
          method: 'getOpenId'
        }
        commonApi.postApi('/pet/api/pet.do', params).then((res) => {
          console.log(res.data)
          if (res.data.status === '1') {
            let wxInfo = res.data.data
//            this.userOpenId = wxInfo.openId
            this.subscribe = wxInfo.subscribe // 'true'为已关注，‘false’为未关注
          } else if (res.data.status === '-1') {
            this.$router.replace({name: 'Failure'})
          } else {
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    components: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .activityEnd{
    position: relative;
    width: 100%;
  }
  .activityEnd img{
    display: block; width: 100%; height: auto;
  }
  .care{
    position: absolute; left: 50%; top: 63%; z-index: 2; margin-left: -100px;
    width: 200px; height: 60px; border-radius: 24px;
    background-color: #f26f55; font-size: 28px;/*px*/  text-align: center; line-height: 60px;
    color: #fff;
  }
</style>
