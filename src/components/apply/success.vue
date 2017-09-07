<template>
  <div class="applySuccess">
    <div class="award">
      <template v-if="isApprove">
        <div class="success-img">
          <img class="success-icon" src="../../assets/images/success_img.png" alt="">
        </div>
        <h2 class="success-title">参赛成功</h2>
      </template>
      <template v-else>
        <div class="inReview">
          <img src="../../assets/images/review_img.jpg" alt="">
          <h2>审核中......</h2>
          <p>
            提交成功，正在审核，参赛成功后<br>
            您可以在“我的”页面中查看您发布的内容。
          </p>
        </div>
      </template>

      <div class="award-con">
        <div class="award-word" v-html="joinSuccess">
          <!--为答谢您的参与，特赠送一份<br>-->
          <!--价值<span>888元的扫地机器人</span>一台，<br>-->
          <!--您可以到任意一家麦田门店领取。-->
        </div>
        <div class="award-img" v-show="joinSuccessPic">
          <img :src="'/pet/'+joinSuccessPic" alt="">
        </div>
        <div class="link-box">
          <router-link  to="/nearStore" class="goNear">
            <span>附近门店</span>
          </router-link>
          <router-link v-if="isApprove"  to="/mine"  class="goMine">
            <span>我的参赛作品</span>
          </router-link>
          <a v-if="isApprove" href="javascript:;"  class="share" @click="popShare">
            <span>分享</span>
          </a>
        </div>
      </div>
    </div>
    <share-pop v-show="shareShow"  @isShare="closeShare" :pet-detail="petDetail" :user-nick-name="userNickName"></share-pop>
  </div>
</template>

<script>
  import commonApi from 'common/js/http'
  import SharePop from 'base/share/share'
//  import { Toast } from 'mint-ui'
  import wxShare from 'common/js/wxconfig'
  export default {
    name: 'home',
    data () {
      return {
        msg: '报名成功',
        activityId: '', // 活动Id
        activityExpire: false, // 活动到期
        isApprove: false, // 是否审核通过
        joinSuccessPic: '', // 活动奖品图
        joinSuccess: '', // 活动文案
        shareShow: false,
        petDetail: {},
        userOpenId: '', // 用户的openId
        userNickName: '', // 用户的昵称
        shareHost: 'http://pet.maitian.cn/pet/', // 分享域名
        shareImg: '', // 分享图片
        shareUrl: '', // 分享地址
        petId: '', // 宠物id
        joinNumber: '', // 宠物编号
        activityIntroduceText: '', // 活动文案
        gzTopLogo: '' // 公众号logo图
      }
    },
    mounted() {
      this.getActivityInfo() // 获取活动信息
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
            this.userOpenId = wxInfo.openId
//            this.userNickName = wxInfo.nickname
            this.getWorkInfo()
          } else if (res.data.status === '-1') {
            this.$router.replace({name: 'Failure'})
          } else {
          }
        }).catch((error) => {
          console.log(error)
        })
      },
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
            this.activityId = res.data.data.id
            this.joinSuccessPic = res.data.data.joinSuccessPic // 活动奖品图
            this.joinSuccess = res.data.data.joinSuccess // 活动奖品描述带html
            this.activityIntroduceText = res.data.data.activityIntroduceText // 活动文案
            this.gzTopLogo = res.data.data.gzTopLogo // 公众号logo图
            this.getOpenId() // 获取openId
          } else if (res.data.status === '2') {
//            Toast('活动到期')
            this.activityExpire = true
            this.activityId = res.data.data.id
            this.joinSuccessPic = res.data.data.joinSuccessPic // 活动奖品图
            this.joinSuccess = res.data.data.joinSuccess // 活动奖品描述带html
            this.activityIntroduceText = res.data.data.activityIntroduceText // 活动文案
            this.gzTopLogo = res.data.data.gzTopLogo // 公众号logo图
            this.getOpenId() // 获取openId
          } else {
//            Toast('活动结束')
            this.$router.replace({name: 'ActivityEnd'})
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getWorkInfo() {
        const params = {
          method: 'findMyWorks',
          openId: this.userOpenId
        }
        console.log(params)
        commonApi.postApi('/pet/api/pet.do', params).then((res) => {
          console.log(res.data)
          if (res.data.status === '-1') {
            this.$router.replace({name: 'Failure'})
          } else if (res.data.status === '1') {
            this.petDetail = res.data.data.petDetail
            this.petId = this.petDetail.id
            this.joinNumber = this.petDetail.joinNumber
            this.shareImg = this.petDetail.petTopPic
            let petWxUser = res.data.data.petWxUser
            this.userNickName = petWxUser.nickname
            let checkStatus = this.petDetail.checkStatus
            if (checkStatus === '1') {
              this.isApprove = true
              this.getShareData() // 获取分享接口
            } else if (checkStatus === '0') {
              this.isApprove = false
              this.getIndexShareData() // 获取首页分享
            }
          } else {
//            Toast('发布失败')
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getShareData() {
        const params = {
          method: 'getMyHomeShareUrl',
          pid: this.petId, // petId
          no: this.joinNumber // 编号
        }
        commonApi.postApi('/pet/api/pet.do', params).then((res) => {
//          console.log(res.data)
          if (res.data.status === '1') {
            this.shareUrl = res.data.data
            let shareObj = {
              shareTitle: '麦田萌宠大赛' + this.petDetail.joinNumber + '号' + this.userNickName,
              shareDesc: '我正在参加麦田幸福社区萌宠大赛，编号' + this.petDetail.joinNumber + '赶快来支持我吧！',
              shareUrl: this.shareUrl,
              shareImg: this.shareHost + this.shareImg
            }
            let currentUrl = location.href.split('#')[0]
//            alert(JSON.stringify(shareObj))
//            alert(JSON.stringify(currentUrl))
            wxShare(shareObj, currentUrl) // 微信分享
          } else if (res.data.status === '-1') {
            this.$router.replace({name: 'Failure'})
          } else {
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getIndexShareData() {
        const params = {
          method: 'getIndexShareUrl'
        }
        commonApi.postApi('/pet/api/pet.do', params).then((res) => {
//          console.log(res.data)
          if (res.data.status === '1') {
            let shareUrl = res.data.data
            let shareObj = {
              shareTitle: '麦田萌宠评选',
              shareDesc: this.activityIntroduceText,
              shareUrl: shareUrl,
              shareImg: this.gzTopLogo
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
      },
      popShare() {
        this.shareShow = true
      },
      closeShare() {
        this.shareShow = false
      }
    },
    components: {
      SharePop
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
 .applySuccess{
   width: 100%; min-height: 100%; padding: 50px 40px;
   background-image: url("../../assets/images/home_bg.png");
   background-size: 100% auto;
   background-repeat: repeat-y;
 }
  .award{
    width 100%; min-height 100%;
    border 4px solid #c58b01;/*px*/ border-radius 8px;/*px*/
    background-color #fdf6d6;
    .inReview{
      width 100%; padding 40px 0 20px;
      border-bottom 4px dashed #e9d78c;
      img{
        width 181px; margin 0 auto; display block;
      }
        h2{
          font-size 48px;/*px*/ color #af9b7e; line-height 100px; text-align center;
        }
          p{
            font-size 28px;/*px*/ content #5b3920; line-height 48px; text-align center;
          }
    }
    .success-img{
      position relative; width 100%; height 250px;
    }
    .success-icon{
      position absolute; top -30px; left 50%;
      width 500px; height 250px; margin-left -250px;
    }
    .success-title{
      padding-bottom 10px;
      font-size 48px;/*px*/ color #ff6f36; text-align center;
    }
        .award-word{
          width 100%; padding 20px;
          font-size 28px;/*px*/ color #5b3920; line-height 50px;
          em{
            font-style italic
          }
          p{
            font-size 28px;/*px*/ color #5b3920; line-height 50px;
          }
          span{
            color #ff6f36;
          }
        }
          .award-img{
            width 330px; margin 0 auto; border 2px solid #ffd964;/*px*/
            background-color #fff;
            img{
              display block;width 100%; height auto;
            }
          }
            .link-box{
              width 100%; padding 80px 0; overflow hidden; text-align center;
              a{
                position relative;
                display inline-block; height 60px; margin 0 10px; padding 0 10px 0 60px;
                border-radius 8px;/*px*/
                background-color #ff6f35;
                font-size 26px;/*px*/ color #fff; line-height 60px;
                &:before{
                  content '';
                  position absolute; left 10px; top 50%;
                  width 40px; height 40px; margin-top -20px;
                  background-image url("../../assets/images/success_icon.png");
                  background-size 40px 150px;
                }
                &.goNear:before{
                  background-position 0 0;
                }
                &.goMine:before{
                  background-position 0 -50px;
                }
                &.share:before{
                  background-position 0 -100px;
                }
                &.share{
                  margin-right 0;
                }
              }
            }
  }
</style>
