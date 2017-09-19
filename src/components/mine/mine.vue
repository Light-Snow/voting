<template>
  <div class="mine" v-cloak>
    <div v-if="isApply === '1'" v-cloak>
      <div class="pet-top">
        <div class="share-near" v-show="!activityExpire">
          <a href="javascript:;"  class="share" @click="sureShare">
            <i></i>分享拉票
          </a>
          <router-link  to="/nearStore" class="goNear">
            <i></i>附近门店
          </router-link>
        </div>
        <div class="head">
          <img :src="headImgUrl" alt="">
        </div>
        <p v-if="myPetDetail.joinNumber" class="wei-name">参赛编号:{{myPetDetail.joinNumber}}，ID:{{userNickName}}</p>
        <p v-else class="wei-name">ID:{{userNickName}}</p>
      </div>
      <div class="pet-middle">
        <ul>
          <li>
            <h3>排名</h3>
            <p v-if="isApprove">{{ranking}}</p>
            <p v-if="!isApprove">---</p>
          </li>
          <li>
            <h3>票数</h3>
            <p>{{myPetDetail.voteNumber}}</p>
          </li>
          <li>
            <h3>访问</h3>
            <p>{{myPetDetail.accessNumber}}</p>
          </li>
        </ul>
      </div>
      <div class="pet-con">
        <div class="introduce">
          <div class="editInfo" @click="goApply(myPetDetail.id)">编辑资料</div>
          <h3></h3>
          <p>{{myPetDetail.introduce}}
          </p>
        </div>
        <div class="video-box" v-show="petVideoList.length>0">
          <review-mask v-if="!isApprove"></review-mask>
          <video v-for="video in petVideoList" ref="video" width="100%"  controls :poster="'/pet/'+video.videoFrame">
            <source :src="'/pet/'+video.videoAddress" :type="video.videoType">
          </video>
        </div>
        <div class="img-list" v-show="petPicList.length>0">
          <div class="img-item" v-for="(pic,index) in petPicList">
            <review-mask v-if="!isApprove"></review-mask>
            <img @click="isPreview(index)" :src="'/pet/'+pic.picAddress" alt="">
          </div>
        </div>
      </div>
      <div v-show="shareGuide" class="share-guide" @click="closeShareGuide">
        <share-guide></share-guide>
      </div>
      <div class="pic-preview" v-show="picPreview" @click="closePreview">
        <img :src="previewImg" alt="">
      </div>
    </div>
    <mine-not-apply v-if="isApply === '0'"
                    :nick-name="userNickName"
                    :is-expire="activityExpire"  v-cloak>
    </mine-not-apply>
    <tab></tab>
  </div>
</template>

<script>
  import commonApi from 'common/js/http'
  import Tab from 'base/tab/tab'
  import ShareGuide from 'base/share/share-guide'
  import ReviewMask from 'base/review-mask/review-mask'
  import MineNotApply from 'components/mine/mine-not'
  import { Toast } from 'mint-ui'
  import wxShare from 'common/js/wxconfig'
  import wx from 'weixin-js-sdk'
  export default {
    name: 'mine',
    data () {
      return {
        msg: '88号宠物',
        activityId: '', // 活动Id
        activityIntroduceText: '', // 活动文案
        activityExpire: false, // 活动到期
        isApply: '2', // 2是不知道有没有报名，1是有报名，0是没有
        isApprove: false, // 是否审核通过
        shareGuide: false, // 是否显示分享引导
        userOpenId: '', // 我的openId
        userNickName: '', // 微信昵称
        headImgUrl: '', // 微信头像
        ranking: '', // 我的排名
        picPreview: false,
        previewImg: '',
        petPicList: [],
        petVideoList: [],
        myPetDetail: {}, // 我的作品信息
        shareHost: 'http://pet.maitian.cn/pet/', // 分享域名
        shareImg: '', // 分享图片
        shareUrl: '', // 分享地址
        petId: '', // 宠物id
        joinNumber: '', // 宠物编号
        gzTopLogo: '' // 公众号logo图
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.getActivityInfo() // 获取活动信息
      })
    },
    computed: {
    },
    methods: {
      isPreview(index) {
//        this.previewImg = img
//        this.picPreview = true
        let picList = this.petPicList.map(item => {
          item = this.shareHost + item.picAddress
          return item
        })
        let isWeiXin = navigator.userAgent.indexOf('MicroMessenger') > -1
        let currentUrl = location.href.split('#')[0]
        if (isWeiXin) {
          commonApi.postApi('/pet/api/pet.do', {
            method: 'getWeixinInfo',
            url: currentUrl
          }).then((res) => {
            console.log(res.data)
            if (res.data.status === '1') {
              let wxData = res.data.data
              wx.config({
                debug: false,
                appId: wxData.appId, // 和获取Ticke的必须一样------必填，公众号的唯一标识
                timestamp: wxData.timestamp, // 必填，生成签名的时间戳
                nonceStr: wxData.nonceStr, // 必填，生成签名的随机串
                signature: wxData.signature, // 必填，签名，见附录1
                // 需要分享的列表项:发送给朋友，分享到朋友圈，分享到QQ
                jsApiList: [
                  'previewImage'
                ]
              })
            } else {
              Toast('微信未授权')
            }
          }).catch((error) => {
            console.log(error)
          })
        }
        // 处理验证成功的信息
        wx.ready(function () {
          wx.previewImage({
            current: picList[index],
            urls: picList
          })
        })
      },
      closePreview() {
        this.picPreview = false
      },
      goApply(myPetDetailId) {
        if (this.activityExpire) {
          Toast('活动已到期，感谢您的关注，更多活动请关注公众号！')
          return false
        }
        this.$router.push({name: 'Apply', query: {petId: myPetDetailId}})
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
            this.activityIntroduceText = res.data.data.activityIntroduceText
            this.gzTopLogo = res.data.data.gzTopLogo // 公众号logo图
            this.getOpenId() // 获取openId
          } else if (res.data.status === '2') {
            this.activityExpire = true // 活动到期
            this.activityId = res.data.data.id
            this.activityIntroduceText = res.data.data.activityIntroduceText
            this.gzTopLogo = res.data.data.gzTopLogo // 公众号logo图
            this.getOpenId() // 获取openId
          } else {
            this.$router.replace({name: 'ActivityEnd'})
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getOpenId() {
        const params = {
          method: 'getOpenId'
        }
        commonApi.postApi('/pet/api/pet.do', params).then((res) => {
          console.log(res.data)
          if (res.data.status === '1') {
            let wxInfo = res.data.data
            this.userOpenId = wxInfo.openId
            this.userNickName = wxInfo.nickname
            this.getMyPetDetail()
//            this.getPetDetailVisit() // 访问信息
          } else if (res.data.status === '-1') {
            this.$router.replace({name: 'Failure'})
          } else if (res.data.status === '0') {
            this.isApply = '0' // 未报名
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      sureShare() {
        if (this.activityExpire) {
          Toast('活动已到期，感谢您的关注，更多活动请关注公众号！')
          return false
        }
        this.shareGuide = true
      },
      closeShareGuide() {
        this.shareGuide = false
      },
      getMyPetDetail() {
        commonApi.postApi('/pet/api/pet.do', {
          method: 'findMyWorks',
          openId: this.userOpenId
        }).then((res) => {
//          alert(JSON.stringify(res.data))
          console.log(res.data)
          if (res.data.status === '1') {
            this.isApply = '1' // 已报名
            this.myPetDetail = res.data.data.petDetail
//            this.myPetDetail.introduce = unescape(this.myPetDetail.introduce)
            this.shareImg = this.myPetDetail.petTopPic
            this.petId = this.myPetDetail.id
            this.joinNumber = this.myPetDetail.joinNumber
            this.ranking = res.data.data.ranking
            let petWxUser = res.data.data.petWxUser
            this.userNickName = petWxUser.nickname
            this.headImgUrl = petWxUser.headImgUrl
            let checkStatus = this.myPetDetail.checkStatus
            if (checkStatus === '1') {
              this.isApprove = true
              this.getShareData() // 获取分享接口
            } else if (checkStatus === '0') {
              this.isApprove = false
              this.getIndexShareData() // 获取首页分享
            }
            if (typeof (res.data.data.petPicList) !== 'undefined' && res.data.data.petPicList) {
              this.petPicList = res.data.data.petPicList
            }
            if (typeof (res.data.data.petVideoList) !== 'undefined' && res.data.data.petVideoList) {
              this.petVideoList = res.data.data.petVideoList
            }
          } else if (res.data.status === '-1') {
            this.$router.replace({name: 'Failure'})
          } else if (res.data.status === '2') {
            this.isApply = '0' // 未报名
            this.getIndexShareData() // 获取首页分享
          } else if (res.data.status === '0') {
            Toast('数据异常')
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
          console.log(res.data)
          if (res.data.status === '1') {
            let shareUrl = res.data.data
            let shareObj = {
              shareTitle: '麦田萌宠大赛' + this.joinNumber + '号' + this.userNickName,
              shareDesc: '我正在参加麦田幸福社区萌宠大赛，编号' + this.joinNumber + '赶快来支持我吧！',
              shareUrl: shareUrl,
              shareImg: this.shareHost + this.shareImg
            }
            let currentUrl = location.href.split('#')[0]
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
//            alert(JSON.stringify(shareObj))
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
      getPetDetailVisit() {
        commonApi.postApi('/pet/api/pet.do', {
          method: 'addPetDetailVisit',
          petId: this.petId,
          openId: this.userOpenId
        }).then((res) => {
          console.log(res.data)
          if (res.data.status === '1') {
          } else if (res.data.status === '-1') {
            this.$router.replace({name: 'Failure'})
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    components: {
      Tab, ShareGuide, ReviewMask, MineNotApply
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"
  .pic-preview{
    position fixed; top 0; bottom 0; left 0;
    right:0; z-index 1000; padding 40px;
    background-color rgba(0,0,0,0.6)
    img{
      position absolute; top 50%; left 0;
      width 100%; height auto;
      -webkit-transform:translate(0,-50%);
      -moz-transform:translate(0,-50%)
    }
  }
  .mine{
    width:100%; padding-bottom 100px; min-height 100%;
    background-image url("../../assets/images/home_bg.png")
    background-repeat repeat-y
    background-size 100% auto
    .pet-top{
      position relative;
      width 100%; padding 40px 0 30px;
      background-image url("../../assets/images/pet_top.jpg")
      background-repeat no-repeat
      background-position top center
      background-size 100% 100%
      .share-near{
        position absolute; top 16px; right 10px; z-index 2;
        a{
          position relative;
          display block; height 40px;  padding 0 24px 0 60px; margin-bottom 26px;
          border-radius 20px;/*px*/
          background-color #4e5764;
          font-size 24px;/*px*/ color #fff; line-height 40px;
          i{
            position absolute; left 0; top 50%;
            width 56px; height 56px; margin-top -28px; border-radius 50%;
            background-color #4e5764;
            &:before{
              content '';
              position absolute; left 50%; top 50%;
              width 40px; height 40px; margin-top -20px; margin-left -20px; border-radius 50%;
              background-image url("../../assets/images/success_icon.png");
              background-repeat no-repeat;
              background-size 40px auto;
            }

          }
          &.goNear i:before{
            background-position 0 0;
          }
          &.share i:before{
            background-position 0 -100px;
          }
          &:active{
            background-color #ff6f35;
            i{
              background-color #ff6f35;
            }
          }
        }
      }
      .head{
        width 130px; height 130px; margin 0 auto;
        border-radius 50%;  overflow hidden; border 4px solid #fff;/*px*/
        img{
          display block;
          width 100%; height 100%;border-radius 50%;
        }
      }
      .wei-name{
        width 80%; height 70px; margin 0 auto; font-size 28px;/*px*/ color #fff; line-height 70px; text-align center;
        no-wrap()
      }
    }
    .pet-middle{
      width 100%; height 117px;
      padding 0 7%;
      background-image url("../../assets/images/pet_mbg.jpg")
      background-repeat no-repeat
      background-size 100% 100%
      ul{
        width 100%; overflow hidden;
        li{
          float left; width 33.33%;
          h3{
            padding 18px 0 16px
            font-size 26px;/*px*/ text-align center; color #fff
          }
          p{
            font-size 40px;/*px*/ color #ff895b; text-align center
          }
        }
      }
    }
    .pet-con{
      width 100%; padding 0 7%;
      background-image url("../../assets/images/introduce_bg.png")
      background-repeat no-repeat
      background-position top center
      background-size 100% auto;
      .introduce{
        position relative;
        width 100%; padding-top 20px;
        .editInfo{
          position absolute; top 20px; right 0;
          padding-left 50px;
          font-size 28px;/*px*/ color #4a5361; line-height 40px;/*px*/
          cursor pointer;
          &:before{
            content ''; position absolute; left 0; top 50%;
            width 30px; height 30px; margin-top -15px;
            background-image url("../../assets/images/edit_icon.png")
            background-repeat no-repeat;
            background-size 30px 30px;
          }
        }
        h3{
          width: 174px; height: 40px; margin-bottom 20px;
          background: url('../../assets/images/pet_sprites.png') -10px -210px;
          background-repeat no-repeat
          background-size 540px 260px;
        }
        p{
          min-height 64px;
          padding 0 0 18px 0
          font-size 26px;/*px*/ color #ff895b; line-height 46px;
          word-break : break-all;
        }
      }
      .video-box{
        position relative;
        width 100%; min-height 190px; height auto;
        /*height 190px;*/
        border 2px solid #ffd964;/*px*/
        margin-bottom 20px;
        video{
          display block
          width 100%; height 100%;
          /*background:transparent url('../../assets/images/gou.jpg') 50% 50% no-repeat;*/

        //下面就是background-size，每种浏览器都写一个配置
          -webkit-background-size:cover;
          -moz-background-size:cover;
          -o-background-size:cover;
          background-size:cover;
        }
      }
      .img-list{
        width 100%; overflow hidden;
        -moz-column-count:2; /* Firefox */
        -webkit-column-count:2; /* Safari 和 Chrome */
        column-count:2;
        -webkit-column-width: 48%;
        -moz-column-width: 48%;
        -webkit-column-gap: 2%;
        -moz-column-gap: 2%;
        .img-item{
          position relative;
          display inline-block;
          /*float left;*/
          -moz-page-break-inside: avoid;
          -webkit-column-break-inside: avoid;
          break-inside: avoid;
          /*width 48%;*/
          border 2px solid #ffd964;/*px*/
          margin-bottom 20px;
          &:nth-of-type(2n){
            /*float right;*/
          }
        }
        img{
          width 100%; display inline-block;
        }
      }

    }
  }
  .share-guide{
    position fixed; top 0; left 0; right 0; bottom 0; z-index 1000;
    width 100%; height 100%;
    background-color rgba(0,0,0,0.8);
  }
</style>
