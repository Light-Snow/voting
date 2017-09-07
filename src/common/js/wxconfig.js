import wx from 'weixin-js-sdk'
import commonApi from 'common/js/http'
import { Toast } from 'mint-ui'
let isWeiXin = navigator.userAgent.indexOf('MicroMessenger') > -1
// 微信浏览器内  右上角自定义分享
export default function wxShare(shareObj, currentUrl) {
  // alert(isWeiXin)
  if (isWeiXin) {
    if (typeof wx === 'undefined') return
    // var currentUrl = shareObj.currentUrl
    let shareTitle = shareObj.shareTitle
    let shareUrl = shareObj.shareUrl
    let shareImg = shareObj.shareImg
    let shareDesc = shareObj.shareDesc
    // alert(shareTitle)
    // alert(shareUrl)
    // alert(shareImg)
    // alert(window.location.href.split('#')[0])
    // alert(currentUrl)
    commonApi.postApi('/pet/api/pet.do', {
      method: 'getWeixinInfo',
      url: currentUrl
    }).then((res) => {
      console.log(res.data)
      // alert(JSON.stringify(res.data))
      if (res.data.status === '1') {
        let wxData = res.data.data
        // alert(JSON.stringify(wxData))
        // alert(wxData)
        // alert('nonceStr----' + wxData.nonceStr)
        // alert('签名----' + wxData.signature)
        wx.config({
          debug: false,
          appId: wxData.appId, // 和获取Ticke的必须一样------必填，公众号的唯一标识
          timestamp: wxData.timestamp, // 必填，生成签名的时间戳
          nonceStr: wxData.nonceStr, // 必填，生成签名的随机串
          signature: wxData.signature, // 必填，签名，见附录1
          // 需要分享的列表项:发送给朋友，分享到朋友圈，分享到QQ
          jsApiList: [
            'onMenuShareAppMessage', 'onMenuShareTimeline',
            'onMenuShareQQ', 'onMenuShareQZone'
          ]
        })
      } else {
        Toast('分享未授权')
      }
    }).catch((error) => {
      console.log(error)
    })
    // 处理验证失败的信息
    wx.error(function (res) {
      // console.log('验证失败返回的信息:', res)
    })
    // 处理验证成功的信息
    wx.ready(function () {
//       alert(window.location.href.split('#')[0]);
//       alert(shareTitle + shareUrl + shareImg)
      // 分享到朋友圈
      wx.onMenuShareTimeline({
        title: shareTitle, // 分享标题
        link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        // link: window.location.href.split('#')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareImg, // 分享图标
        success: function (res) {
          // 用户确认分享后执行的回调函数
          // alert('分享到朋友圈成功返回的信息为:', res)
          // console.log('分享成功!')
        },
        cancel: function (res) {
          // 用户取消分享后执行的回调函数
          Toast('取消分享到朋友圈')
        }
      })
      // 分享给朋友
      wx.onMenuShareAppMessage({
        title: shareTitle, // 分享标题
        desc: shareDesc, // 分享描述
        link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareImg, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function (res) {
          // 用户确认分享后执行的回调函数
          // console.log('分享给朋友成功返回的信息为:', res)
        },
        cancel: function (res) {
          // 用户取消分享后执行的回调函数
          Toast('取消分享给朋友')
        }
      })
      // 分享到QQ
      wx.onMenuShareQQ({
        title: shareTitle, // 分享标题
        desc: shareDesc, // 分享描述
        link: shareUrl, // 分享链接
        imgUrl: shareImg, // 分享图标
        success: function (res) {
          // 用户确认分享后执行的回调函数
          // console.log('分享到QQ好友成功返回的信息为:', res)
        },
        cancel: function (res) {
          // 用户取消分享后执行的回调函数
          Toast('取消分享给QQ好友')
        }
      })
      // 分享到QQ空间
      wx.onMenuShareQZone({
        title: shareTitle, // 分享标题
        desc: shareDesc, // 分享描述
        link: shareUrl, // 分享链接
        imgUrl: shareImg, // 分享图标
        success: function (res) {
          // 用户确认分享后执行的回调函数
          // console.log('分享到QQ空间成功返回的信息为:', res)
        },
        cancel: function (res) {
          // 用户取消分享后执行的回调函数
          Toast('取消分享到QQ空间')
        }
      })
    })
  }
}
export function getLocation () {
  if (isWeiXin) {
    if (typeof wx === 'undefined') return
    commonApi.postApi('/pet/api/pet.do', {
      method: 'getWeixinInfo',
      url: location.href.split('#')[0]
    }).then((res) => {
      console.log(res.data)
      // alert(JSON.stringify(res.data))
      if (res.data.status === '1') {
        let wxData = res.data.data
        // alert(JSON.stringify(wxData))
        // alert(wxData)
        // alert('签名----' + wxData.signature)
        wx.config({
          debug: true,
          appId: wxData.appId, // 和获取Ticke的必须一样------必填，公众号的唯一标识
          timestamp: wxData.timestamp, // 必填，生成签名的时间戳
          nonceStr: wxData.nonceStr, // 必填，生成签名的随机串
          signature: wxData.signature, // 必填，签名，见附录1
          // 需要分享的列表项:发送给朋友，分享到朋友圈，分享到QQ
          jsApiList: [
            'getLocation'
          ]
        })
      } else {
        Toast('分享未授权')
      }
    }).catch((error) => {
      console.log(error)
    })
    // 处理验证失败的信息
    wx.error(function (res) {
      // console.log('验证失败返回的信息:', res)
    })
    // 处理验证成功的信息
    wx.ready(function () {
      wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
          // var latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
          // var longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
          // var speed = res.speed // 速度，以米/每秒计
          // var accuracy = res.accuracy // 位置精度
          let location = {
            'lng': res.latitude, // 纬度，浮点数，范围为90 ~ -90
            'lat': res.longitude // 经度，浮点数，范围为180 ~ -180。
          }
          // alert(JSON.stringify(location))
          return location
        }
      })
    })
    // return false
  }
}
