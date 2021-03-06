import axios from 'axios'
import qs from 'qs'
import { Toast } from 'mint-ui'
/**
 * get请求
 * @param  {String} options.server 服务器域名
 * @param  {String} options.url   api地址
 * @param  {String} options.query query参数
 * @return {Promise}               Promise
 */
const _get = (api, query) => {
  let _url
  if (query) {
    _url = `${api}?${query}`
  } else {
    _url = `${api}`
  }
//  console.log('>> '.concat(_url))
  return axios.get(_url).then((res) => {
//    console.log('axios.get[then]: ', res)
    return res
  }, (errorRes) => {
//    console.log('axios.get[error]: ', errorRes)
    return Promise.reject(errorRes)
  })
  .catch((error) => {
//    console.log('axios.get[catch]: ', error)
    return Promise.reject(error)
  })
}

/**
 * post请求
 * @param  {String} options.server 服务器域名
 * @param  {String} url    api地址
 * @param  {Object} params 包含post内容的object
 * @return {Promise}        Promise
 */
const _post = (api, params) => {
  // axios的请求时间
  // let axiosDate = new Date()
  // Indicator.open({
  //   text: '加载中...',
  //   spinnerType: 'triple-bounce'
  // })
  const _url = `${api}`
//  console.log(_url)
//  console.log('params: ', params)
  const data = qs.stringify(params)
  console.log(data)
  return axios.post(_url, data).then((res) => {
//    console.log('axios.post[then]: ', res)
    // 关闭  loading图片消失
    // let oDate = new Date()
    // let time = oDate.getTime() - axiosDate.getTime()
    // if (time < 500) time = 500
    // setTimeout(() => {
    //   Indicator.close()
    // }, time)
    return res
  }, (errorRes) => {
//    console.log('axios.post[error]: ', errorRes)
    // 关闭  loading图片消失
    // Indicator.close()
    // axiosDate = new Date()
    let instance = Toast('数据请求失败')
    setTimeout(() => {
      instance.close()
    }, 2000)
    return Promise.reject(errorRes)
  })
  .catch((error) => {
//    console.log('axios.post[catch]: ', error)
    let instance = Toast('数据请求失败')
    setTimeout(() => {
      instance.close()
    }, 2000)
    return Promise.reject(error)
  })
}

/**
 * put请求
 * @param  {String} options.server 服务器域名
 * @param  {String} url    api地址
 * @param  {Object} params 包含post内容的object
 * @return {Promise}        Promise
 */
const _put = (api, params) => {
  const _url = `${api}`
//  console.log(_url)
  return axios.put(_url, params).then((res) => {
//    console.log('axios.put[then]: ', res)
    return res
  }, (errorRes) => {
//    console.log('axios.put[error]: ', errorRes)
    return Promise.reject(errorRes)
  })
  .catch((error) => {
//    console.log('axios.put[catch]: ', error)
    return Promise.reject(error)
  })
}

/**
 * delete请求
 * @param  {String} options.server 服务器域名
 * @param  {String} url    api地址
 * @param  {Object} params 包含post内容的object
 * @return {Promise}        Promise
 */
const _delete = (api, query) => {
  let _url
  if (query) {
    _url = `${api}/${query}`
  } else {
    _url = `${api}`
  }
//  console.log(_url)
  return axios.delete(_url).then((res) => {
//    console.log('axios.delete[then]: ', res)
    return res
  }, (errorRes) => {
//    console.log('axios.delete[error]: ', errorRes)
    return Promise.reject(errorRes)
  })
  .catch((error) => {
//    console.log('axios.delete[catch]: ', error)
    return Promise.reject(error)
  })
}
export default {
  postApi: _post,
  putApi: _put,
  deleteApi: _delete,
  getApi: _get
}
