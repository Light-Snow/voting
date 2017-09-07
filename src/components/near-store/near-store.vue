<template>
  <div class="map">
    <div id="allmap" class="all-map"></div>
    <div class="info-bg" v-show="showInfo" @click="closeBg">
    </div>
    <div class="map-info" :class="{'hide': !showInfo}">
      <div class="info-box">
        <h2 class="title">{{mapTitle}}</h2>
        <p>{{mapDetail}}</p>
      </div>
    </div>
    <div class="get-position" @click="position"></div>
  </div>
</template>

<script>
  import commonApi from 'common/js/http'
  import BMap from 'BMap'
  import BMapLib from 'BMapLib'
//  import BMAP_ANCHOR_TOP_LEFT from 'BMAP_ANCHOR_TOP_LEFT'
//  import BMAP_NAVIGATION_CONTROL_LARGE from 'BMAP_NAVIGATION_CONTROL_LARGE'
  import BMAP_STATUS_SUCCESS from 'BMAP_STATUS_SUCCESS'
  import { Toast } from 'mint-ui'
  import wxShare from 'common/js/wxconfig'
  export default {
    name: 'map',
    data () {
      return {
        msg: '地图组件',
        activityIntroduceText: '', // 活动文案
        address_detail: null, // 详细地址
        userLocation: {
          lng: '116.404',
          lat: '39.915'
        },
        map: {},
        bounds: {},
        mapList: [],
        showInfo: false,
        mapTitle: '',
        mapDetail: ''
      }
    },
    props: {
    },
    created() {
    },
    mounted() {
      let _this = this
      this.getActivityInfo() // 获取活动信息
      this.ready()
      this.map = new BMap.Map('allmap')
      this.$nextTick(function () {
        // 百度地图API功能
        let point = new BMap.Point(this.userLocation.lng, this.userLocation.lat)
        this.map.centerAndZoom(point, 14)
        let bs = this.map.getBounds()   // 获取可视区域
        bs.getSouthWest()   // 可视区域左下角
        bs.getNorthEast()   // 可视区域右上角
//        this.map.enableScrollWheelZoom() // 设置地图可缩放大小
        this.position()
      })
      this.map.addEventListener('tilesloaded', _this.addMyLabel())
      this.map.addEventListener('zoomend', _this.addMyLabel())
      this.map.addEventListener('moveend', function () {
        _this.addMyLabel()
      })
    },
    computed: {
    },
    watch: {
    },
    methods: {
      position() {
        let _this = this
        let geolocation = new BMap.Geolocation()
        geolocation.getCurrentPosition(function(r) {
          if (this.getStatus() === BMAP_STATUS_SUCCESS) {
            console.log(r.point)
            let mk = new BMap.Marker(r.point)
            _this.map.addOverlay(mk)
            _this.map.panTo(r.point)
          } else {
            Toast('无法获取当前设备的定位信息，请检查相应设置')
          }
        }, {enableHighAccuracy: true})
      },
      ready: function () {
        commonApi.postApi('/pet/api/pet.do', {
          method: 'getShopList'
        }).then((res) => {
          console.log(res.data)
          if (res.data[0].status === '1') {
            this.mapList = res.data[0].data
            console.log(this.mapList.length)
            this.addMyLabel()
          } else if (res.data.status === '-1') {
//            this.$router.replace({name: 'Failure'})
          } else {
          }
        }).catch((error) => {
          console.log(error)
        })
        // 编写自定义函数,创建标注
//        function addMarker(point) {
//          var marker = new BMap.Marker(point)
//          map.addOverlay(marker)
//        }
      },
      addMyLabel() {
        let _this = this
        for (var i = 0; i < this.mapList.length; i++) {
          let abscissa = this.mapList[i].abscissa
          let ordinate = this.mapList[i].ordinate
          let name = this.mapList[i].name
//              console.log(abscissa, ordinate)
          let point = new BMap.Point(abscissa, ordinate)
//              addMarker(point)
          var opts = {
            position: point,    // 指定文本标注所在的地理位置
            offset: new BMap.Size(-35, -15)    // 设置文本偏移量
          }
          var label = new BMap.Label(name, opts)  // 创建文本标注对象
          label.setStyle({
            width: '100px',
            textAlign: 'center',
            color: '#fff',
            fontSize: '12px',
            fontFamily: '微软雅黑',
            background: 'rgba(46,212,157,0.9)',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 10px'
          })
          var result = BMapLib.GeoUtils.isPointInRect(point, this.map.getBounds())
          if (result === true) {
            this.map.addOverlay(label)
//            label.show()
            addClickHandler(this.mapList[i].name, this.mapList[i].address, label)
          } else {
            this.map.removeOverlay(label)
//            label.hide()
          }
        }
        function addClickHandler(name, content, marker) {
          marker.addEventListener('click', function(e) {
//            openInfo(content, e)
            var p = e.target
            var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat)
            console.log(point)
            _this.mapTitle = name
            _this.mapDetail = content
            _this.showInfo = true
          })
        }
//        function openInfo(content, e) {
//          var p = e.target
//          var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat)
//          var infoWindow = new BMap.InfoWindow(content, opts)  //  创建信息窗口对象
//          _this.map.openInfoWindow(infoWindow, point) // 开启信息窗口
//        }
      },
      closeBg() {
        this.showInfo = false
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
      }
    },
    components: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .map{
    position: relative;
    width: 100%; height: 100%;
  }
  .all-map{
    width: 100%; height: 100%;
  }
  .get-position{
    position: fixed; right: 40px; bottom: 240px; z-index: 998;
    width: 80px; height: 80px; border-radius: 50%;
    background-image: url("../../assets/images/position.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .info-bg{
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    width: 100%; height: 100%; z-index: 999;
    background-color: rgba(51,51,51,0.3);
  }
  .map-info{
    position: absolute; left: 0; bottom: 0; z-index: 1000;
    width: 100%; height: 160px; overflow: hidden;
    background-color: #fff;
    transition: height 0.5s;
    -moz-transition: height 0.5s; /* Firefox 4 */
    -webkit-transition: height 0.5s; /* Safari 和 Chrome */
    -o-transition: height 0.5s; /* Opera */
  }
  .map-info.hide{
    height: 0;
  }
  .info-box{
    padding: 20px 40px 50px;
  }
  .map-info .title{
    font-size: 28px;/*px*/ color: #333;
    line-height: 50px;/*px*/
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .map-info p{
    min-height: 40px;
    font-size: 24px;/*px*/ color: #888;
    line-height: 48px;/*px*/
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
