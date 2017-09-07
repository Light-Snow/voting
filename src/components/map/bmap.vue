<template>
  <div class="map">
    <div id="allmap" class="all-map"></div>
    <div class="map-info" :class="{'show': showInfo}">
      <h2 class="title">{{mapTitle}}</h2>
      <p>{{mapDetail}}</p>
    </div>
  </div>
</template>

<script>
  import commonApi from 'common/js/http'
  import BMap from 'BMap'
  import BMapLib from 'BMapLib'
  export default {
    name: 'map',
    data () {
      return {
        msg: '地图组件',
        address_detail: null, // 详细地址
        userlocation: {lng: '', lat: ''},
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
      this.map = new BMap.Map('allmap')
      this.ready()
      let _this = this
      this.map.addEventListener('tilesloaded', _this.addMyLabel())
      this.map.addEventListener('moveend', function () {
        _this.addMyLabel()
      })
    },
    computed: {
    },
    watch: {
    },
    methods: {
      ready: function () {
        // 百度地图API功能
        var point = new BMap.Point(116.404, 39.915)
        this.map.centerAndZoom(point, 14)
        let bs = this.map.getBounds()   // 获取可视区域
        bs.getSouthWest()   // 可视区域左下角
        bs.getNorthEast()   // 可视区域右上角
        this.map.enableScrollWheelZoom() // 设置地图可缩放大小
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
//          this.map.addOverlay(label)
          var result = BMapLib.GeoUtils.isPointInRect(point, this.map.getBounds())
          if (result === true) {
            this.map.addOverlay(label)
            addClickHandler(this.mapList[i].name, this.mapList[i].address, label)
          } else {
            this.map.removeOverlay(label)
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
  .map-info{
    position: absolute; left: 0; bottom: -180px;/*px*/  z-index: 999;
    width: 100%; padding: 20px 40px 50px;
    background-color: #fff;
    transition: bottom 0.5s;
    -moz-transition: bottom 0.5s; /* Firefox 4 */
    -webkit-transition: bottom 0.5s; /* Safari 和 Chrome */
    -o-transition: bottom 0.5s; /* Opera */
  }
  .map-info.show{
    bottom: 0;
  }
  .map-info .title{
    min-height: 56px;/*px*/
    font-size: 32px;/*px*/ color: #333;
    line-height: 56px;/*px*/
  }
  .map-info p{
    min-height: 44px;/*px*/
    font-size: 28px;/*px*/ color: #888;
    line-height: 48px;/*px*/
  }
</style>
