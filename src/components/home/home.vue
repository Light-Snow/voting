<template>
  <div class="home">
    <div class="top-box">
      <img class="banner" :src="'/pet/'+ headPic" alt="">
      <!--<a href="javascript:;" class="we-chat"></a>-->
      <!--<span v-show="subscribe === 'true'" class="attention">已关注</span>-->
      <router-link  class="search-box" to="/search">
        <div class="search-icon"></div>
      </router-link>
      <div class="roll">
        <!--<span>{{activityIntroduceText}}</span>-->
        <marquee  behavior="" scrollAmount="5" direction="left">
          <span>{{activityIntroduceText}}</span>
          <!--麦田社区评选萌宠活动开始了，参加活动有礼物相送哦～-->
        </marquee>
      </div>
    </div>
    <div class="list-box">
      <div class="list-tab clearFix">
        <div class="type-list">
          <div class="checked" @click="toggleList">{{typeName}}<i></i></div>
          <ul v-show="typeList">
            <li v-for="(type,index) in typeListName" @click="checkType(index)" :class="typeName===type.name?'active':''">{{type.name}}</li>
          </ul>
        </div>
        <div class="tab-icon" :class="rankType==='findPetNewList'?'active':''" @click="checkRankType('findPetNewList')">最新</div>
        <div class="tab-icon" :class="rankType==='findPetHotList'?'active':''" @click="checkRankType('findPetHotList')">最热</div>
        <div class="apply-box">
          <!--<router-link v-if="!isApply"  class="apply" to="/apply"></router-link>-->
          <div v-if="!isApply"  class="apply" to="/apply" @click="goApply"></div>
          <span v-else class="applied"></span>
        </div>
      </div>
      <ul class="animal-list clearFix"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="40"
          :infinite-scroll-immediate-check="isLoadMore"
          v-show="petList.length > 0"
      >
        <li v-for="(item, index) in petList">
          <div  class="animal-info" @click="goPetDetail(item.id,item.joinNumber)">
            <i class="flag" :class="{'wang':item.belongTag==='1','miao': item.belongTag==='2'}"></i>
            <span class="petTopPic">
                <img v-lazy="'/pet/'+item.petTopPic"  alt="">
              </span>
            <p>
              <span class="num">{{item.joinNumber}}号</span>
              <span class="poll">{{item.voteNumber}}票</span>
            </p>
          </div>
          <!--<router-link  class="animal-info" :to="{ name: 'PetDetail', params: { pid: item.id, num: item.joinNumber}}">-->
          <!--</router-link>-->
          <template v-if="item.id===votedPetID||item.dayVisitFlag==='0'">
            <div class="vote-btn voted" ></div>
          </template>
          <template v-else>
            <div  class="vote-btn vote"  @click="votePet(item.id,item)"></div>
          </template>
        </li>
      </ul>
      <p v-show="loading" class="page-infinite-loading">
        <mt-spinner type="fading-circle"></mt-spinner>
        <br>加载中...
      </p>
      <p v-show="noMore" class="page-infinite-loading">
         数据已加载完
      </p>
      <!--<div class="load-more-box">-->
        <!--<mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange"-->
                     <!--ref="loadmore"-->
                     <!--:auto-fill="isFill"-->
                     <!--v-cloak>-->
        <!--</mt-loadmore>-->
      <!--</div>-->
    </div>
    <tab></tab>
  </div>
</template>

<script>
  import Tab from 'base/tab/tab'
  import commonApi from 'common/js/http'
  import { Toast } from 'mint-ui'
  import wxShare from 'common/js/wxconfig'
  export default {
    name: 'home',
    data () {
      return {
        msg: '首页',
        isFill: true,
        activityId: '', // 活动Id
        activityExpire: false, // 活动到期
        activityIntroduceText: '', // 活动文案
        headPic: '../../assets/images/banner.jpg', // 头图地址
        subscribe: '', // 是否关注
        isApply: false, // 是否报名
        isHot: '', // 是否是最热
        typeName: '全部', // 动物类型
        typeList: false, // 动物类型下拉框是否显示
        typeListName: [
          {belongTag: '', name: '全部'},
          {belongTag: '1', name: '汪星人'},
          {belongTag: '2', name: '喵星人'},
          {belongTag: '3', name: '其  他'}
        ],
        userOpenId: '',
        belongTag: '', // 宠物标签（1代表汪星人，2代表喵星人，3代表其它,全部为空）
        rankType: 'findPetNewList', // findPetNewList最新，findPetHotList最热
        currentPage: 0, // 当前页数
        pageSize: 6, // 每页多少数据
        noMore: false, // 判断数据是否加载完
        petList: [],
        topStatus: '',
        loading: false, // 是否要执行滚动加载
        votedPetID: '', // 已投票的id
        voteStatus: false,
        voting: false, // 是否时投票中
        listGetting: false
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.getOpenId() // 获取openId
        this.getActivityInfo() // 获取活动信息
        this._getPetList()
      })
    },
    activated() {
      alert('333')
    },
    computed: {
      isLoadMore() {
        return (this.petList.length > 5) ? 'true' : 'false'
      }
    },
    methods: {
      goPetDetail(pid, num) {
        this.$router.push({name: 'PetDetail', params: { pid: pid, num: num }})
//        if (this.topStatus === 'pull') {
//          this.$router.push({name: 'PetDetail', params: { pid: pid, num: num }})
//        }
      },
      goApply() {
        if (!this.activityExpire) {
          this.$router.push({name: 'Apply'})
        } else {
          Toast('活动到期,将不能报名')
        }
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
            this.subscribe = wxInfo.subscribe // 'true'为已关注，‘false’为未关注
            this.getPetDetail()
            this._getVisit() // 记录访问人
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
            this.headPic = res.data.data.headPic // 头图地址banner
            this.activityIntroduceText = res.data.data.activityIntroduceText // 活动文案
            let gzTopLogo = res.data.data.gzTopLogo
            this.getIndexShareData(gzTopLogo) // 分享首页
          } else if (res.data.status === '2') {
//            Toast('活动到期')
            this.activityExpire = true
            this.activityId = res.data.data.id
            this.headPic = res.data.data.headPic // 头图地址banner
            this.activityIntroduceText = res.data.data.activityIntroduceText // 活动文案
            let gzTopLogo = res.data.data.gzTopLogo
            this.getIndexShareData(gzTopLogo) // 分享首页
          } else {
//            Toast('活动结束')
            this.$router.replace({name: 'ActivityEnd'})
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getPetDetail() {
        console.log(this.openId)
        commonApi.postApi('/pet/api/pet.do', {
          method: 'findMyWorks',
          openId: this.userOpenId
        }).then((res) => {
          if (res.data.status === '1') {
            this.isApply = true // 已报名
          } else if (res.data.status === '-1') {
            this.$router.replace({name: 'Failure'})
          } else {
            this.isApply = false // 未报名
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getIndexShareData(gzTopLogo) {
        console.log(gzTopLogo)
        const params = {
          method: 'getIndexShareUrl'
        }
        commonApi.postApi('/pet/api/pet.do', params).then((res) => {
//          console.log(res.data)
          if (res.data.status === '1') {
            let shareUrl = res.data.data
            console.log(shareUrl)
            let shareObj = {
              shareTitle: '麦田萌宠评选',
              shareDesc: this.activityIntroduceText,
              shareUrl: shareUrl,
              shareImg: gzTopLogo
            }
            console.log(shareObj)
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
      handleTopChange(status) {
        console.log(status)
        this.topStatus = status
      },
      loadTop() {
        this.typeName = '全部'
        this.belongTag = ''
        this.rankType = 'findPetNewList'
        this._clearData() // 清除数据
        this._getPetList()
        this.$refs.loadmore.onTopLoaded()
      },
      toggleList() {
        this.typeList = !this.typeList
      },
      checkType(index) {
        this.typeList = !this.typeList
        this.typeName = this.typeListName[index].name
        this.belongTag = this.typeListName[index].belongTag
        this._clearData() // 清除数据
        this._getPetList()
      },
      checkRankType(type) {
        if (type === 'findPetHotList') {
          this.isHot = 'hot'
        }
//        this.belongTag = ''
//        this.typeName = '全部'
        this.rankType = type
        this._clearData() // 清除数据
        this._getPetList()
      },
      loadMore() {
        if (!this.noMore) {
          this.loading = true
          setTimeout(() => {
            this._getPetList()
          }, 300)
        }
      },
      votePet(petId, item) {
        if (this.activityExpire) {
          Toast('活动已到期，感谢您的关注，更多活动请关注公众号！')
          return false
        }
        commonApi.postApi('/pet/api/pet.do', {
          method: 'repeatVote',
          openId: this.userOpenId,
          petId: petId.replace(/\s+/g, '') // 去下空格
        }).then((res) => {
          console.log(res.data)
          if (res.data.status === '1') {
            Toast('您已为该朋友投票')
            this.votedPetID = petId
          } else if (res.data.status === '0') {
            this._voteRun(petId, item)
          } else if (res.data.status === '-1') {
            this.$router.replace({name: 'Failure'})
          } else {
            console.log(res.data.msg)
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      _voteRun(petId, item) {
        if (!this.voting) {
          this.voting = true
          commonApi.postApi('/pet/api/pet.do', {
            method: 'addVoteNumber',
            petId: petId, // 去下空格
            openId: this.userOpenId
          }).then((res) => {
            this.voting = false
            console.log(res.data)
            if (res.data.status === '1') {
              item.dayVisitFlag = '0'
              item.voteNumber = parseInt(item.voteNumber) + 1
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
      _getPetList() {
//        console.log('nomore', this.noMore)
        if (this.noMore) {
          this.loading = false // 将不再执行loadmore
          return false
        }
        console.log(this.currentPage, this.rankType)
        if (!this.listGetting) {
          this.listGetting = true
          commonApi.postApi('/pet/api/pet.do', {
            method: this.rankType,
            belongTag: this.belongTag, // 宠物标签（1代表汪星人，2代表喵星人，3代表其它,全部为空）
            start: this.currentPage, // 起始页
            pageSize: this.pageSize, // 页显示数
            voterOpenId: this.userOpenId,
            orderFlag: this.isHot
          }).then((res) => {
            console.log(res.data)
            if (res.data.status === '-1') {
              this.listGetting = false
              this.$router.replace({name: 'Failure'})
            } else if (res.data.status === '1') {
              if (res.data.data.length < this.pageSize) {
                this.loading = false // 隐藏加载图标
                this.noMore = true
                console.log(this.loading, this.noMore)
              }
              if (res.data.data.length > 0) {
                this.currentPage = ++this.currentPage
              }
              console.log(this.currentPage)
              let petList = res.data.data
              this.petList = this.petList.concat(petList)
              this.loading = false // 隐藏加载图标
              console.log(petList)
              this.listGetting = false
//            alert(JSON.stringify(petList))
            }
          }).catch((error) => {
            this.listGetting = false
            console.log(error)
          })
        }
      },
      _clearData() { // 清除数据
        this.currentPage = 0
        this.petList = []
        this.noMore = false
        this.loading = false
      },
      _getVisit() {
        commonApi.postApi('/pet/api/pet.do', {
          method: 'addPetVisit',
          openId: this.userOpenId
        }).then((res) => {
          console.log(res.data)
          if (res.data.status === '-1') {
            this.$router.replace({name: 'Failure'})
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
<style scoped lang="stylus" rel="stylesheet/stylus">
  .page-infinite-loading {
    text-align: center;
    /*height: 50px;*/
    line-height: 50px;
    span{
      display: inline-block;
    }
    div {
      display: inline-block;
      vertical-align: middle;
      margin-right: 5px;
    }
  }
  .load-more-box{
    width 100%; min-height 500px;
  }
  .home
    width 100%; min-height 100%;
    background-color #fff2bb;
    .top-box
      position relative
      width 100%
      .we-chat
        position absolute
        left 28px
        top 18px
        z-index 2
        width 170px
        height 34px
        background-image url("../../assets/images/mt_logo.png")
        background-repeat no-repeat
        background-size 100% 100%
      .attention
        position absolute
        left 210px
        top 16px
        z-index 2
        width 100px
        height 40px
        border-radius 8px;/*px*/ border 2px solid #25151b;/*px*/
        font-size 24px;/*px*/ color #fff; text-align center; line-height 36px;
        background-color #32a1ff
      .banner
        display block
        width 100%; height 486px;
      .search-box{
        position absolute
        top 3%
        right: 3%
        width 88px; height 88px;
      }
      .search-icon
        width 63px
        height 56px
        margin 12px 0 0 11px;
        background-image url("../../assets/images/search.png")
        background-repeat no-repeat
        background-size 100% 100%
      .roll
        position absolute
        bottom 0
        left 0
        width 100%
        height 54px
        overflow hidden;
        span
          display block
          height 54px
          font-size 26px;/*px*/
          color #2b2d2d
          line-height 54px;
          text-shadow:#fff2bb 2px 0 0,#fff2bb 0 2px 0,#fff2bb -2px 0 0,#fff2bb 0 -2px 0;
          -webkit-text-shadow:#fff2bb 2px 0 0,#fff2bb 0 2px 0,#fff2bb -2px 0 0,#fff2bb 0 -2px 0;
          -moz-text-shadow: #fff2bb 2px 0 0,#fff2bb 0 2px 0,#fff2bb -2px 0 0,#fff2bb 0 -2px 0;
          filter: Glow(color=#fff2bb, strength=2);
          white-space:nowrap;
          /*animation: rowleft 10s linear 0 infinite normal;*/
          /*-webkit-animation: rowleft 10s  linear 0 infinite normal;*/
          /*-moz-animation: rowleft 10s  linear 0 infinite normal;*/
          /*-ms-animation: rowleft 10s  linear 0 infinite normal;*/
          /*-o-animation: rowleft 10s  linear 0 infinite normal;*/
    .list-box
      width 100%
      padding 0 0 125px 0
      background-image url("../../assets/images/home_bg.png")
      background-repeat repeat-y
      background-size 100% auto
      .list-tab
        position relative
        width 100%
        height 94px
        padding 12px 240px 0 200px
        background-image url("../../assets/images/list_tab.png")
        background-repeat no-repeat
        background-size 100% 100%
        .type-list
          position absolute
          left 40px;
          top 12px; z-index 10;
          width 156px
          /*height 50px*/
          border 3px solid #2c2d2d;/*px*/
          border-radius 8px
          background-color #ff6f35
          .checked
            position relative
            padding-left 16px; padding-right 30px;
            font-size 28px;/*px*/
            color #fff
            line-height 50px
            i
              position absolute; top 14px; right 10px;
              width 20px
              height 20px;
              background-image url("../../assets/images/triangle_icon.png")
              background-repeat no-repeat
              background-size 100% 100%
          ul
            padding-top 10px
          li
            height 56px; margin-bottom 4px;
            font-size 24px;/*px*/
            color #2b2d2d
            text-align center
            line-height 56px
            &.active{
              background-image url("../../assets/images/type_active.png")
              background-repeat no-repeat
              background-size 100% 100%
            }
        .tab-icon{
          float left
          width 124px; height 56px; margin-left 8px; line-height 50px; text-align center;
          font-size 28px;/*px*/ color #2b2d2d
          border 3px solid transparent;/*px*/
          &.active{
            border 3px solid #2c2d2d;/*px*/
            border-radius 8px; color #fff
            background-color #ff6f35
          }
        }
        .apply-box{
          position absolute; top 10px; right 16px;
          width 222px; height 62px; overflow hidden;
          .apply{
            display block;
            width 222px; height 62px;
            background-image url("../../assets/images/apply.png")
            background-repeat no-repeat
            background-size 100% 100%
          }
          .applied{
            display block;
            width 222px; height 62px;
            background-image url("../../assets/images/applied.png")
            background-repeat no-repeat
            background-size 100% 100%
          }
        }
      .animal-list{
        width 100%; padding 0 2.4%;
        li{
          float left; width 50%; padding 36px 34px 0;
          a{
            display block
          }
          .animal-info{
            position relative
            padding 10px;
            border 4px solid #2b2d2d;/*px*/
            border-radius 8px;
            background-color #ff6631;
            .flag{
              position absolute;right -24px;
              top:-27px; width:70px; height 70px;
              &.miao{
                background-image url("../../assets/images/miao.png")
                background-repeat no-repeat
                background-size 70px 70px
              }
              &.wang{
                background-image url("../../assets/images/wang.png")
                background-repeat no-repeat
                background-size 70px 70px
              }
            }
          }
          .petTopPic{
            display block;
            width 100%; height 260px; overflow hidden;
          }
          img{
            display block;
            width 260px; height auto; max-width 100%; min-height 260px;
            margin 0 auto;
          }
          img[lazy=loading] {
            width: 80px
            height: 260px
            margin: auto
          }
            p{
              overflow hidden;
              span {
                padding 20px 0 10px;
                font-size 28px;/*px*/ color #fff2bb;
                &.num{ float:left; padding-left 4px; }
                &.poll{
                  float:right; padding-left 50px;/*px*/ padding-right 4px;
                  background-image url("../../assets/images/ling.png")
                  background-repeat no-repeat
                  background-size 48px 48px;/*px*/
                  background-position left 12px
                }
              }

            }
          .vote-btn{
            width 100%; height 80px; margin-top 6px;
            background-image url("../../assets/images/vote.png")
            background-repeat no-repeat
            background-size auto 80px;
            background-position: center;
            &.vote{
              background-image url("../../assets/images/vote.png")
            }
            &.voted{
              background-image url("../../assets/images/voted.png")
            }
          }

        }
      }
  @keyframes rowleft {
    0%{
      transform : translate(99%,0)
      -ms-transform:translate(99%,0); 	/* IE 9 */
      -moz-transform:translate(99%,0); 	/* Firefox */
      -webkit-transform: translate(99%,0); /* Safari 和 Chrome */
      -o-transform:translate(99%,0); 	/* Opera */
    }
    100%{
      transform : translate(-100%,0)
      -ms-transform:translate(-100%,0); 	/* IE 9 */
      -moz-transform:translate(-100%,0); 	/* Firefox */
      -webkit-transform: translate(-100%,0); /* Safari 和 Chrome */
      -o-transform:translate(-100%,0); 	/* Opera */
      display none
    }
  }
  @-moz-keyframes rowleft {
    0%{
      transform : translate(99%,0)
      -ms-transform:translate(99%,0); 	/* IE 9 */
      -moz-transform:translate(99%,0); 	/* Firefox */
      -webkit-transform: translate(99%,0); /* Safari 和 Chrome */
      -o-transform:translate(99%,0); 	/* Opera */
    }
    100%{
      transform : translate(-100%,0)
      -ms-transform:translate(-100%,0); 	/* IE 9 */
      -moz-transform:translate(-100%,0); 	/* Firefox */
      -webkit-transform: translate(-100%,0); /* Safari 和 Chrome */
      -o-transform:translate(-100%,0); 	/* Opera */
      display none
    }
  }
  @-webkit-keyframes rowleft {
    0%{
      transform : translate(99%,0)
      -ms-transform:translate(99%,0); 	/* IE 9 */
      -moz-transform:translate(99%,0); 	/* Firefox */
      -webkit-transform: translate(99%,0); /* Safari 和 Chrome */
      -o-transform:translate(99%,0); 	/* Opera */
    }
    100%{
      transform : translate(-100%,0)
      -ms-transform:translate(-100%,0); 	/* IE 9 */
      -moz-transform:translate(-100%,0); 	/* Firefox */
      -webkit-transform: translate(-100%,0); /* Safari 和 Chrome */
      -o-transform:translate(-100%,0); 	/* Opera */
      display none
    }
  }
  @-o-keyframes rowleft {
    0%{
      transform : translate(99%,0)
      -ms-transform:translate(99%,0); 	/* IE 9 */
      -moz-transform:translate(99%,0); 	/* Firefox */
      -webkit-transform: translate(99%,0); /* Safari 和 Chrome */
      -o-transform:translate(99%,0); 	/* Opera */
    }
    100%{
      transform : translate(-100%,0)
      -ms-transform:translate(-100%,0); 	/* IE 9 */
      -moz-transform:translate(-100%,0); 	/* Firefox */
      -webkit-transform: translate(-100%,0); /* Safari 和 Chrome */
      -o-transform:translate(-100%,0); 	/* Opera */
      display none
    }
  }
</style>
