<template>
  <div class="search">
    <div class="search-top">
      <input ref="searchInput" class="search-text" v-model.trim="searchText" @blur="searchInfo"  type="search" placeholder="请输入用户名、手机号、编号" maxlength="100">
      <span class="search-btn" @click="searchInfo"></span>
    </div>

    <div class="search-list" v-show="searchList.length>0">
      <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore" :autoFill="isFill">
        <ul v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="40"
            :infinite-scroll-immediate-check="isLoadMore"
        >
          <li v-for="item in searchList">
            <div  class="clearFix" @click="goPetDetail(item.id,item.joinNumber)">
              <div class="logo-box">
                <img v-lazy="'/pet/'+item.petTopPic"  alt="">
              </div>
              <dl>
                <dt>{{item.joinNumber}}号宠物</dt>
                <dd>ID:{{item.userNickname}}</dd>
              </dl>
              <div class="poll">
                <span class="num">{{item.voteNumber}}</span>
                <span>票数</span>
              </div>
            </div>
          </li>
        </ul>
        <p v-show="loading" class="page-infinite-loading">
          <mt-spinner type="fading-circle"></mt-spinner>
          <br>加载中...
        </p>
        <p v-show="noMore" class="page-infinite-loading">
          数据已加载完
        </p>
      </mt-loadmore>
    </div>
    <div class="no-data" v-show="noResult">
      抱歉，没有找到（{{searchText}}）的相关数据，<br>
      换个条件试试吧~
    </div>
  </div>
</template>

<script>
  import commonApi from 'common/js/http'
  import wxShare from 'common/js/wxconfig'
  export default {
    name: 'search',
    data () {
      return {
        msg: '搜索',
        activityId: '',
        activityIntroduceText: '',
        getting: false, // 是否是请求中
        noResult: false, // 是否有搜索结果
        isFill: true, // 是否有搜索结果
        belongTag: '', // 宠物标签（1代表汪星人，2代表喵星人，3代表其它,全部为空）
        searchText: '', // 搜索文案
        currentPage: 0, // 当前页数
        pageSize: 10, // 每页多少数据
        topStatus: '',
        noMore: false, // 判断数据是否加载完
        searchList: [],
        loading: false, // 是否加载图标
        scrollMode: 'auto' // 移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
      }
    },
    watch: {
      searchText() {
        this.noResult = false
        this._clearData()
      }
    },
    mounted() {
      this.$nextTick(() => {
//        this.$refs.searchInput.focus()
      })
    },
    computed: {
      isLoadMore() {
        return (this.searchList.length > 9) ? 'true' : 'false'
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
//            this.activityId = res.data.data.id
            this.activityIntroduceText = res.data.data.activityIntroduceText
            let gzTopLogo = res.data.data.gzTopLogo
            this.getIndexShareData(gzTopLogo) // 分享首页
          } else if (res.data.status === '2') {
//            this.activityId = res.data.data.id
//            this.activityExpire = true
            this.activityIntroduceText = res.data.data.activityIntroduceText
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
      },
      goPetDetail(pid, num) {
        if (this.topStatus === 'pull') {
          this.$router.push({name: 'PetDetail', params: { pid: pid, num: num }})
        }
      },
      searchInfo(e) {
        this._clearData()
        if (this.searchText.length !== 0 && this.searchText) {
          this._getPetList()
        }
      },
      _clearData() {
        this.currentPage = 0
        this.searchList = []
        this.noMore = false
        this.loading = false
        this.scrollMode = 'auto'
      },
      handleTopChange(status) {
//        console.log(status)
        this.topStatus = status
      },
      loadTop() {
        this._clearData() // 清除数据
        this._getPetList()
        this.$refs.loadmore.onTopLoaded()
      },
      loadMore() {
        if (!this.noMore) {
          this.loading = true
          setTimeout(() => {
            if (this.searchText.length !== 0 && this.searchText) {
              this._getPetList()
            }
          }, 300)
        }
      },
      _getPetList() {
        console.log('nomore', this.noMore)
        if (this.noMore) {
          this.loading = false // 将不再执行loadmore
          return false
        }
        if (!this.getting) {
          this.getting = true
          console.log(this.searchText)
          commonApi.postApi('/pet/api/pet.do', {
            method: 'findPetHotList',
            belongTag: this.belongTag, // 宠物标签（1代表汪星人，2代表喵星人，3代表其它,全部为空）
            start: this.currentPage, // 起始页
            pageSize: this.pageSize, // 页显示数
            likeFind: this.searchText // 搜索项
          }).then((res) => {
            this.getting = false
//          console.log(res.data.data)
//            alert(JSON.stringify(res.data.data))
            if (res.data.status === '1') {
              if (res.data.data.length < this.pageSize) {
                this.loading = false // 隐藏加载图标
                this.noMore = true
              }
              if (res.data.data.length > 0) {
                this.currentPage = ++this.currentPage
              }
              console.log(this.currentPage)
              let petList = res.data.data
              this.searchList = this.searchList.concat(petList)
              this.loading = false // 隐藏加载图标
              if (this.searchList.length <= 0 && this.searchText.replace(/(^s*)|(s*$)/g, '').length !== 0) {
                this.noResult = true
              }
              this.$nextTick(function () {
                // 这里之所以加是因为有个坑，iphone在使用-webkit-overflow-scrolling属性，就是移动端弹性滚动效果时会屏蔽loadmore的上拉加载效果，
                // 花了好久才解决这个问题，就是用这个函数，意思就是先设置属性为auto，正常滑动，加载完数据后改成弹性滑动，安卓没有这个问题，移动端弹性滑动体验会更好
                this.scrollMode = 'touch'
              })
            } else if (res.data.status === '-1') {
              this.$router.replace({name: 'Failure'})
            }
          }).catch((error) => {
            console.log(error)
            this.getting = false
          })
        }
      }
    },
    components: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"
  .mint-loadmore{
    min-height 100%;
  }
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
  .no-data{
    width 100%; padding 150px 20px 20px; text-align center;
    font-size 28px;/*px*/ line-height 48px;/*px*/ color #999
    word-break:break-all
  }
  .search{
    height 100%;
  }
  .search-top{
    position: fixed; top 0; left 0; z-index 999;
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

  .search-list{ display block;height 100%; width: 100%; min-height 100%; padding: 116px 22px 22px 22px;}
  .search-list li{
    width: 100%; padding: 10px; margin-bottom 20px;
    background-color: #fdf9e4;
    a{
      display block;
    }
    .logo-box{
      float: left; width: 90px; height: 90px;
      border: 2px solid #c58b01;/*px*/
      img{
        display: block; width: 100%;
      }
      img[lazy=loading] {
        width: 40px
        height: 90px
        margin: auto
      }
    }
    dl{
      float left; padding-left 28px; max-width 64%;
      dt{
        line-height 50px; font-size 30px;/*px*/ color #000;
      }
      dd{
        font-size 22px;/*px*/  color #656256; line-height 36px;
        no-wrap()
      }
    }
    .poll{
      float right;
      span{
        display block;
        font-size 22px;/*px*/ text-align right; color #656256; line-height 36px;
        &.num{
          font-size 30px;/*px*/  color #ff6f36; font-weight 600;line-height 50px;
        }
      }
    }
  }
</style>
