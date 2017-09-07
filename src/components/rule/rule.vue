<template>
  <div class="rule">
    <div class="rule-detail">
      <div class="rule-title"></div>
      <img v-show="ruleData.joinPrizePic" class="detail-img" :src="'/pet/'+ruleData.joinPrizePic" alt="">
    </div>
    <tab></tab>
  </div>
</template>

<script>
  import Tab from 'base/tab/tab'
  import commonApi from 'common/js/http'
  import wxShare from 'common/js/wxconfig'
  export default {
    name: 'home',
    data () {
      return {
        msg: '规则',
        activityId: '',
        activityIntroduceText: '',
        ruleData: {}
      }
    },
    mounted() {
      this.getActivityInfo() // 获取活动信息
      this.$nextTick(function () {
      })
    },
    computed: {
    },
    methods: {
      getActivityInfo() {
        const params = {
          method: 'findAvailablePetActivity',
          activityId: this.activityId
        }
        commonApi.postApi('/pet/api/pet.do', params).then((res) => {
          console.log(res.data)
          if (res.data.status === '-1') {
            this.$router.replace({name: 'Failure'})
          } else if (res.data.status === '1') {
            this.ruleData = res.data.data
            this.activityId = res.data.data.id
            this.activityIntroduceText = res.data.data.activityIntroduceText // 活动文案
            let gzTopLogo = res.data.data.gzTopLogo
            this.getIndexShareData(gzTopLogo) // 分享首页
          } else if (res.data.status === '2') {
            this.ruleData = res.data.data
            this.activityId = res.data.data.id
            this.activityIntroduceText = res.data.data.activityIntroduceText // 活动文案
//            this.activityExpire = true
            let gzTopLogo = res.data.data.gzTopLogo
            this.getIndexShareData(gzTopLogo) // 分享首页
          } else {
            this.$router.replace({name: 'ActivityEnd'})
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getIndexShareData(gzTopLogo) {
//        console.log(gzTopLogo)
        const params = {
          method: 'getIndexShareUrl'
        }
        commonApi.postApi('/pet/api/pet.do', params).then((res) => {
//          console.log(res.data)
          if (res.data.status === '1') {
            let shareUrl = res.data.data
//            console.log(shareUrl)
            let shareObj = {
              shareTitle: '麦田萌宠评选',
              shareDesc: this.activityIntroduceText,
              shareUrl: shareUrl,
              shareImg: gzTopLogo
            }
//            console.log(shareObj)
            let currentUrl = location.href.split('#')[0]
            wxShare(shareObj, currentUrl) // 微信分享
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
      Tab
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .rule{
   width: 100%; min-height: 100%; padding: 50px 40px 150px;
   background-image: url("../../assets/images/home_bg.png");
   background-repeat: repeat-y;
   background-size: 100% auto;
 }
  .rule-detail{
    position: relative;
    width: 100%; border-radius: 16px;/*px*/
    background-color: #ff6631;
  }
 .rule-title{
   position: absolute; top: -27px; left: 50%; margin-left: -127px;
   width: 254px; height: 99px;
   background-image: url("../../assets/images/rule_title.png");
   background-repeat: no-repeat;
   background-size: 100% 100%;
 }
  .detail-img{
    display: block;
    width: 100%; height: auto;border-radius: 16px;/*px*/
  }
</style>
