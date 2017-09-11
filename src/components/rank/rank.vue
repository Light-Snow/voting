<template>
  <div class="rank">
    <div class="search-top">
      <input class="search-text"  @focus="goSearch"  type="text" placeholder="请输入用户名、手机号、编号">
      <span class="search-btn" @click="goSearch"></span>
    </div>
    <div class="rank-con">
      <div class="con-img"></div>
      <!--<img class="con-img" src="../../assets/images/rank_img.png" alt="">-->
      <div class="list-con">
        <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore" :auto-fill="true">
          <ul class="pet-list"
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="loading"
              infinite-scroll-distance="40"
              :infinite-scroll-immediate-check="isLoadMore"
          >
            <li class="clearFix" v-for="(item,index) in rankList" @click.stop="goPetDetail(item.id,item.joinNumber)">
              <div class="logo-box">
                <span class="rank-num">{{index+1}}</span>
                <i class="star" v-show="index === 0"></i>
                <div class="img-box">
                  <img v-lazy="'/pet/'+item.petTopPic" alt="">
                </div>
              </div>
              <dl>
                <dt>{{item.joinNumber}}号宠物</dt>
                <dd>ID:{{item.userNickname}}</dd>
                <dd><span>{{item.belongTagStr}}</span></dd>
              </dl>
              <div class="poll">
                <span class="num">{{item.voteNumber}}</span>
                <span>票数</span>
              </div>
            </li>
            <li v-show="loading" class="page-infinite-loading">
              <mt-spinner type="fading-circle"></mt-spinner>
              <br>加载中...
            </li>
            <li v-show="noMore" class="page-infinite-loading">
              数据已加载完
            </li>
          </ul>
        </mt-loadmore>
      </div>
    </div>
    <tab></tab>
  </div>
</template>

<script>
  import Tab from 'base/tab/tab'
  import commonApi from 'common/js/http'
  import wxShare from 'common/js/wxconfig'
//  import { Toast } from 'mint-ui'
  export default {
    name: 'home',
    data () {
      return {
        msg: '排名',
        getting: false, // 是否是请求中
        activityId: '',
        activityIntroduceText: '',
        belongTag: '', // 宠物标签（1代表汪星人，2代表喵星人，3代表其它,全部为空）
        currentPage: 0, // 当前页数
        pageSize: 7, // 每页多少数据
        noMore: false, // 判断数据是否加载完
        rankList: [],
        loading: false, // 是否要执行滚动加载
        scrollMode: 'auto' // 移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.getActivityInfo() // 获取活动信息
        this.getRankList()
      })
    },
    activated () {
      this.getActivityInfo() // 获取活动信息
    },
    computed: {
      isLoadMore() {
        return (this.rankList.length > 6) ? 'true' : 'false'
      }
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
            this.activityId = res.data.data.id
            this.activityIntroduceText = res.data.data.activityIntroduceText // 活动文案
            let gzTopLogo = res.data.data.gzTopLogo
            this.getIndexShareData(gzTopLogo) // 分享首页
          } else if (res.data.status === '2') {
//            Toast('活动到期')
            this.activityId = res.data.data.id
//            this.activityExpire = true
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
      },
      goPetDetail(pid, num) {
        if (this.topStatus === 'pull') {
          this.$router.push({name: 'PetDetail', params: { pid: pid, num: num }})
        }
      },
      goSearch() {
        this.$router.push({ name: 'Search' })
      },
      _clearData() {
        this.currentPage = 0
        this.rankList = []
        this.noMore = false
        this.loading = false
        this.scrollMode = 'auto'
      },
      handleTopChange(status) {
        console.log('status', status)
        this.topStatus = status
      },
      loadTop() {
        this._clearData() // 清除数据
        this.getRankList()
        this.$refs.loadmore.onTopLoaded()
      },
      loadMore() {
        if (!this.noMore) {
          this.loading = true
          setTimeout(() => {
            this.getRankList()
          }, 300)
        }
      },
      getRankList() {
        if (this.noMore) {
          this.loading = false // 将不再执行loadmore
          return false
        }
        if (!this.getting) {
          this.getting = true
          commonApi.postApi('/pet/api/pet.do', {
            method: 'findPetHotList',
            belongTag: this.belongTag, // 宠物标签（1代表汪星人，2代表喵星人，3代表其它,全部为空）
            start: this.currentPage, // 起始页
            pageSize: this.pageSize // 页显示数
          }).then((res) => {
            this.getting = false
//          console.log(res.data.data)
//            alert(JSON.stringify(res.data.data))
            if (res.data.status === '1') {
              if (res.data.data.length < this.pageSize) {
                this.loading = false // 将不再执行loadmore
                this.noMore = true
              }
              if (res.data.data.length > 0) {
                this.currentPage = ++this.currentPage
              }
              console.log(this.currentPage)
              let petList = res.data.data
              this.rankList = this.rankList.concat(petList)
              this.loading = false // 隐藏加载图标
              console.log(petList)
              this.$nextTick(function () {
                // 这里之所以加是因为有个坑，iphone在使用-webkit-overflow-scrolling属性，就是移动端弹性滚动效果时会屏蔽loadmore的上拉加载效果，
                // 花了好久才解决这个问题，就是用这个函数，意思就是先设置属性为auto，正常滑动，加载完数据后改成弹性滑动，安卓没有这个问题，移动端弹性滑动体验会更好
                this.scrollMode = 'touch'
              })
            } else if (res.data.status === '-1') {
              this.$router.replace({name: 'Failure'})
            }
          }).catch((error) => {
            this.getting = false
            console.log(error)
          })
        }
      }
    },
    components: {
      Tab
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"
  .rank{
    width 100%; min-height 100%;
    background-image url("../../assets/images/rank_bg.png");
    background-repeat repeat-y;
    background-size 100% auto;
    .search-top{
      position: relative;
      width:100%; height: 94px; padding: 16px 0 0 6%;
      background: url("../../assets/images/search_bg.png") no-repeat 0 0;
      background-size: 100% 100%;
      .search-text{
        width : 84%; height: 54px; padding: 12px 14px; border: 0; background-color: transparent;
        font-size: 28px;/*px*/ color:#c58b01;
      }
      input::-webkit-input-placeholder{
              color:#c58b01;
            }
      input:focus::-webkit-input-placeholder{
        color:#c58b01;
      }
      .search-btn{
        position: absolute; top:12px; right: 24px;
        width: 66px; height: 58px;
      }
    }
    .rank-con{
      width 100%; padding-bottom 125px;
      .con-img{
        display block; width 100%; height 196px;
        background-image url("../../assets/images/rank_img.png");
        background-repeat no-repeat;
        background-size 100% 100%;
      }
      .list-con{
        width 100%; min-height 270px;
        background-image url("../../assets/images/rank_conbg.png");
        background-repeat no-repeat;
        background-size 100% auto;
      }
      .pet-list{
        width 100%; padding 50px 7.1% 0;
        .page-infinite-loading {
          text-align: center;
          line-height: 50px;
          background-color transparent;
          span{
            display: inline-block;
          }
          div {
            display: inline-block;
            vertical-align: middle;
            margin-right: 5px;
          }
        }
        li{
          width 100%; margin-bottom 30px; padding 4px 30px;
          background-color: rgba( 253, 247, 221,0.8);
          .logo-box{
            position relative;
            float left; width 160px; height 160px; border:2px solid #c58b01;/*px*/
            .rank-num{
              position absolute;
              top:-14px; left -14px; z-index 2;
              width 46px;/*px*/ height 46px;/*px*/ line-height 44px;/*px*/ text-align center; color #fff;
              border-radius 50%; border 2px solid #fff;/*px*/
              background-color #ff6f35;
            }
            .star{
              position absolute;
              right:-40px;/*px*/ top -50px;/*px*/ z-index 2;
              width 80px;/*px*/ height 80px;/*px*/
              background-image url("../../assets/images/star.png")
              background-repeat no-repeat; background-size 100% 100%;
            }
            .img-box{
              width 100%; height 100%; overflow hidden
            }
            img{
              display block; width 100%; height auto;
            }
            img[lazy=loading] {
              width: 60px
              height: 160px
              margin: auto
            }
          }
          dl{
            float left; padding-left 28px; padding-top 10px; max-width 50%
            dt{
              line-height 46px; font-size 30px;/*px*/ color #000;
            }
            dd{
              padding 10px 0;
              font-size 22px;/*px*/  color #656256;
              no-wrap()
              span{
                display inline-block;
                padding 6px 8px;/*px*/
                border 2px dashed rgb( 255, 111, 53 );/*px*/
                border-radius: 4px;/*px*/
                font-size 22px;/*px*/ color #ff6f35; line-height 1;
              }
            }
          }
          .poll{
            float right;
            span{
              display block;
              font-size 22px;/*px*/ text-align right; color #656256;
              &.num{
                padding 20px 0
                font-size 28px;/*px*/  color #ff6f36;
              }
            }
          }
        }
      }
    }
  }
</style>
