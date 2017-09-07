// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import fastclick from 'fastclick'

import 'common/stylus/index.styl'
fastclick.attach(document.body)// 解决点击时会出现300ms的延时的问题
Vue.use(Mint)
Vue.config.productionTip = false

Vue.use(require('vue-wechat-title')) // 修改title
// Vue.prototype.router = router
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
