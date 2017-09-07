<template>
  <div class="petDetail">
    <div class="pet-top">
      <router-link class="go-home" :to="{name: 'Home'}">活动首页</router-link>
      <div class="head">
        <img :src="headImgUrl" alt="">
      </div>
      <p class="wei-name">参赛编号:{{petDetail.joinNumber}}号，ID:{{userNickName}}</p>
    </div>
    <div class="pet-middle">
      <ul>
        <li>
          <h3>排名</h3>
          <p>{{ranking}}</p>
        </li>
        <li>
          <h3>票数</h3>
          <p>{{voteNumber}}</p>
        </li>
        <li>
          <h3>访问</h3>
          <p>{{petDetail.accessNumber}}</p>
        </li>
      </ul>
    </div>
    <div class="pet-con">
      <div class="introduce">
        <h3></h3>
        <p>{{petDetail.introduce}}
        </p>
      </div>
      <div class="video-box" v-show="petVideoList.length>0">
        <video v-for="video in petVideoList" ref="video" width="100%"  :src="'/pet/'+video.videoAddress"  controls :poster="'/pet/'+video.videoFrame">
          <source :src="'/pet/'+video.videoAddress" :type="video.videoType">
        </video>
      </div>
      <div class="img-list" v-show="petPicList.length>0">
        <div class="img-item" v-for="(pic,index) in petPicList">
          <img @click="isPreview(index)" :src="'/pet/'+pic.picAddress" alt="">
        </div>
      </div>
    </div>
    <div class="pet-btn">
      <span class="voted" v-if="petDetail.id===votedPetID || petDetail.dayVisitFlag==='0'"></span>
      <span class="vote" v-else @click="votePet"></span>
    </div>
    <div class="pic-preview" v-show="picPreview" @click="closePreview">
      <img :src="previewImg" alt="">
    </div>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui'
  import commonApi from 'common/js/http'
  import wxShare from 'common/js/wxconfig'
  import wx from 'weixin-js-sdk'
  export default {
    name: 'mine',
    data () {
      return {
        msg: '宠物',
        activityId: '', // 活动Id
        activityExpire: false, // 活动到期
        votedPetID: '',
        petDetail: {},
        petPicList: [],
        petVideoList: [],
        ranking: '', // 我的排名
        picPreview: false,
        previewImg: '',
        openId: '',  // 作品人的openId
        userOpenId: '', // 用户的openId
        userNickName: '', // 微信昵称
        headImgUrl: '', // 微信头像
        voteNumber: '', // 票数
        shareHost: 'http://pet.maitian.cn/pet/', // 分享域名
        shareImg: '', // 分享图片
        shareUrl: '', // 分享地址
        petId: '', // 宠物id
        joinNumber: '', // 宠物编号
        voting: false, // 是否时投票中
        activityIntroduceText: '', // 活动文案
        gzTopLogo: '' // 公众号logo图
      }
    },
    mounted() {
      this.petId = this.$route.params.pid
      this.getActivityInfo() // 获取活动信息
      this.$nextTick(function () {
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
      getOpenId() {
        const params = {
          method: 'getOpenId'
        }
        commonApi.postApi('/pet/api/pet.do', params).then((res) => {
          console.log(res.data)
          if (res.data.status === '1') {
            let wxInfo = res.data.data
            this.userOpenId = wxInfo.openId
            this.getPetDetail()
            this.getPetDetailVisit() // 作品详情的访问量
          } else if (res.data.status === '-1') {
            this.$router.replace({name: 'Failure'})
          } else if (res.data.status === '0') {
            this.$router.replace({name: 'Failure'})
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
            this.activityIntroduceText = res.data.data.activityIntroduceText
            this.gzTopLogo = res.data.data.gzTopLogo // 公众号logo图
            this.getOpenId() // 获取openId
          } else if (res.data.status === '2') {
//            Toast('活动到期')
            this.activityExpire = true
            this.activityId = res.data.data.id
            this.activityIntroduceText = res.data.data.activityIntroduceText
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
      votePet() {
        if (this.activityExpire) {
          Toast('活动已到期，感谢您的关注，更多活动请关注公众号！')
          return false
        }
        commonApi.postApi('/pet/api/pet.do', {
          method: 'repeatVote',
          openId: this.userOpenId,
          petId: this.petId.replace(/\s+/g, '') // 去下空格
        }).then((res) => {
          console.log(res.data)
          if (res.data.status === '1') {
            Toast('您已为该朋友投票')
            this.votedPetID = this.petId
          } else if (res.data.status === '0') { // 未投票
            this._voteRun()
          } else if (res.data.status === '-1') {
            this.$router.replace({name: 'Failure'})
          } else {
            return false
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      _voteRun() {
        if (!this.voting) {
          this.voting = true
          commonApi.postApi('/pet/api/pet.do', {
            method: 'addVoteNumber',
            petId: this.petId,
            openId: this.userOpenId
          }).then((res) => {
            this.voting = false
            console.log(res.data)
            if (res.data.status === '1') {
              this.votedPetID = this.petId
              this.voteNumber = parseInt(this.voteNumber) + 1
              Toast('投票成功')
            } else if (res.data.status === '-1') {
              this.$router.replace({name: 'Failure'})
            } else {
              Toast('投票失败，可再次尝试')
            }
          }).catch((error) => {
            this.voting = false
            console.log(error)
          })
        }
      },
      getPetDetail() {
        console.log(this.petId, this.openId)
        commonApi.postApi('/pet/api/pet.do', {
          method: 'findpetDetail',
          petId: this.petId,
          voterOpenId: this.userOpenId
        }).then((res) => {
          if (res.data.status === '1') {
            console.log(res.data)
            this.petDetail = res.data.data.petDetail
//            this.petDetail.introduce = unescape(this.petDetail.introduce)
            this.voteNumber = this.petDetail.voteNumber // 票数
            this.shareImg = this.petDetail.petTopPic
            this.petId = this.petDetail.id
            this.joinNumber = this.petDetail.joinNumber
            this.ranking = res.data.data.ranking
            let petWxUser = res.data.data.petWxUser
            this.userNickName = petWxUser.nickname
            this.headImgUrl = petWxUser.headImgUrl
            if (typeof (res.data.data.petPicList) !== 'undefined' && res.data.data.petPicList) {
              this.petPicList = res.data.data.petPicList
            }
            if (typeof (res.data.data.petVideoList) !== 'undefined' && res.data.data.petVideoList) {
              this.petVideoList = res.data.data.petVideoList
            }
            let checkStatus = this.petDetail.checkStatus
            if (checkStatus === '1') {
              this.getShareData() // 获取分享接口
            } else {
              this.getIndexShareData() // 获取首页分享
            }
          } else if (res.data.status === '-1') {
            this.$router.replace({name: 'Failure'})
          } else if (res.data.status === '3') {
            Toast('原活动已下线')
            this.$router.replace({name: 'Home'})
          } else {
            Toast('该作品不存在')
            this.$router.replace({name: 'Home'})
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
      getPetDetailVisit() {
        commonApi.postApi('/pet/api/pet.do', {
          method: 'addPetDetailVisit',
          petId: this.petId,
          openId: this.userOpenId
        }).then((res) => {
          console.log(res.data)
          if (res.data.status === '1') {
//            console.log(res.data)
          } else if (res.data.status === '-1') {
            this.$router.replace({name: 'Failure'})
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
  .petDetail{
    width:100%; padding-bottom 100px; min-height 100%;
    background-image url("../../assets/images/home_bg.png")
    background-repeat repeat-y
    background-size 100% auto
    .pet-top{
      position relative
      width 100%; padding 40px 0 30px;
      background-image url("../../assets/images/pet_top.jpg")
      background-repeat no-repeat
      background-position top center
      background-size 100% 100%
      .go-home{
        position absolute
        left 40px
        top 16px
        z-index 2
        width 120px
        height 50px
        border-radius 8px;/*px*/ border 2px solid #25151b;/*px*/
        font-size 24px;/*px*/ color #fff; text-align center; line-height 48px;
        background-color #32a1ff
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
        width 80%; margin 0 auto; font-size 28px;/*px*/ color #fff; line-height 70px; text-align center;
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
        width 100%; padding-top 20px;
        h3{
          width: 174px; height: 40px; margin-bottom 20px;
          background: url('../../assets/images/pet_sprites.png') -10px -210px;
          background-repeat no-repeat
          background-size 540px 260px;
        }
        p{
          padding 0 0 18px 0
          font-size 26px;/*px*/ color #ff895b; line-height 46px;
          word-break : break-all;
        }
      }
      .video-box{
        width 100%;
        /*height 190px;*/
        border 2px solid #ffd964;/*px*/
        margin-bottom 20px;
        video{
          position relative; z-index 1;
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
    .pet-btn{
      position fixed
      left 0; bottom 0; z-index 10;
      width 100%; height 90px; padding-bottom 10px;
      span{
        display block;
        width 520px; height 80px; margin 0 auto;

        &.vote{
          background: url('../../assets/images/pet_sprites.png') -10px -10px;
          background-repeat no-repeat
          background-size 540px 260px;
        }
        &.voted{
          background: url('../../assets/images/pet_sprites.png') -10px -110px;
          background-repeat no-repeat
          background-size 540px 260px;
        }
      }
    }
  }
</style>
