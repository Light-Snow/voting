<template>
  <div class="map">
    <baidu-map class="bm-view"
               ak="d6zGANUDmor3AVuE7Iy34UCY"
               :center="center"
               :zoom="15"
               @ready="handler">
      <!--<bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>-->
      <!--<bm-copyright-->
        <!--anchor="BMAP_ANCHOR_TOP_RIGHT"-->
        <!--:copyright="[{id: 1, content: '<span>麦田在线</span>', bounds: {ne: {lng: 110, lat: 40}, sw:{lng: 0, lat: 0}}}]">-->
      <!--</bm-copyright>-->
      <bm-overlay
        pane="labelPane"
        :class="{sample: true, active}"
        @draw="draw"
        @mouseover.native="active = true"
        @mouseleave.native="active = false">
        <div>我爱北京天安门qqqqqqqq</div>
      </bm-overlay>

    </baidu-map>
  </div>
</template>

<script>
  import commonApi from 'common/js/http'
  import {BaiduMap, BmGeolocation, BmCopyright, BmOverlay} from 'vue-baidu-map'
  export default {
    name: 'map',
    data () {
      return {
        msg: '地图',
        mapList: [],
        center: {lng: 0, lat: 0},
        active: false
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.getShopData()
      })
    },
    computed: {
    },
    methods: {
      handler({BMap, map}) {
        console.log(BMap)
        console.log(map)
        this.center.lng = 116.404
        this.center.lat = 39.915
        map.centerAndZoom(new BMap.Point(116.4035, 39.915), 14)
        var bs = map.getBounds()   // 获取可视区域
        bs.getSouthWest()   // 可视区域左下角
        bs.getNorthEast()   // 可视区域右上角
        map.enableScrollWheelZoom() // 设置地图可缩放大小
      },
      draw ({el, BMap, map}) {
        console.log(el)
        const pixel = map.pointToOverlayPixel(new BMap.Point(116.404, 39.915))
        el.style.left = pixel.x - 55 + 'px'
        el.style.top = pixel.y - 35 + 'px'
      },
      getShopData() {
        commonApi.postApi('/pet/api/pet.do', {
          method: 'getShopList'
        }).then((res) => {
          console.log(res.data)
          if (res.data.status === '1') {
            let mapList = res.data
            if (mapList.length > 0) {
              this.mapList = mapList
            }
          } else if (res.data.status === '-1') {
            this.$router.replace({name: 'Failure'})
          } else {
//            Toast('投票失败，可再次尝试')
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    components: {
      BaiduMap, BmGeolocation, BmCopyright, BmOverlay
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .map{
    width: 100%; height: 100%;
  }
  .bm-view {
    width: 100%;
    height: 100%;
  }
  .sample {
    width: 220px;/*px*/
    /*height: 60px;!*px*!*/
    /*line-height: 60px;!*px*!*/
    background: rgba(46,212,157,0.8);
    overflow: hidden;
    box-shadow: 0 0 5px #2ed49d;/*px*/
    font-size: 28px;/*px*/
    color: #fff;
    text-align: center;
    padding: 10px;/*px*/
    position: absolute;
  }
  .sample.active {
    background: rgba(46,212,157,0.9);
    color: #fff;
  }
</style>
