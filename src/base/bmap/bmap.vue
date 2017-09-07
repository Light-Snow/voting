<template>
  <div class="map">
    <input type="text" id="suggestId" name="address_detail" placeholder="如门牌号等" v-model="address_detail" class="input_style">
    <div id="allmap"></div>
  </div>
</template>

<script>
//  import commonApi from 'common/js/http'
  import {MP} from 'common/js/map'
  export default {
    name: 'map',
    data () {
      return {
        msg: '地图组件',
        address_detail: null, // 详细地址
        userlocation: {lng: '', lat: ''}
      }
    },
    props: {
      // 地图在该视图上的高度
      mapHeight: {
        type: Number,
        default: 500
      },
      // 经度
      longitude: {
        type: Number,
        default: 116.404
      },
      // 纬度
      latitude: {
        type: Number,
        default: 39.915
      },
      description: {
        type: String,
        default: '天安门'
      }
    },
    mounted() {
      this.$nextTick(function () {
        MP('你的ak').then(BMap => {
          var th = this
          var map = new BMap.Map('allmap')            // 创建Map实例
          var point = new BMap.Point(116.404, 39.915) // 创建点坐标
          map.centerAndZoom(point, 15)
          map.enableScrollWheelZoom()
          var ac = new BMap.Autocomplete(    // 建立一个自动完成的对象
            {
              'input': 'suggestId',
              'location': map
            })
          var myValue
          ac.addEventListener('onconfirm', function(e) {    // 鼠标点击下拉列表后的事件
            var _value = e.item.value
            myValue = _value.province + _value.city + _value.district + _value.street + _value.business
            this.address_detail = myValue
            setPlace()
          })

          function setPlace() {
            map.clearOverlays()    // 清除地图上所有覆盖物
            function myFun() {
              th.userlocation = local.getResults().getPoi(0).point    // 获取第一个智能搜索的结果
              map.centerAndZoom(th.userlocation, 18)
              map.addOverlay(new BMap.Marker(th.userlocation))    // 添加标注
            }
            var local = new BMap.LocalSearch(map, { // 智能搜索
              onSearchComplete: myFun
            })
            local.search(myValue)
          }
        })
      })
    },
    computed: {
    },
    methods: {
    },
    components: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
