import Vue from 'vue'
import Router from 'vue-router'
import Home from 'components/home/home.vue'
import Apply from 'components/apply/apply.vue'
import ApplySuccess from 'components/apply/success.vue'
import NearStore from 'components/near-store/near-store.vue'
import Rank from 'components/rank/rank.vue'
import Rule from 'components/rule/rule.vue'
import Mine from 'components/mine/mine.vue'
import PetDetail from 'components/pet-detail/pet-detail.vue'
import Search from 'components/search/search.vue'
import ActivityEnd from 'components/fail/end.vue'
import Failure from 'components/fail/failure.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/home', // 首页
      name: 'Home',
      meta: {
        title: '麦田幸福社区萌宠大赛'
      },
      component: Home
      // component: resolve => require(['components/home/home.vue'], resolve)// 按需加载
    },
    {
      path: '/apply', // 报名
      name: 'Apply',
      meta: {
        title: '报名'
      },
      component: Apply
      // component: resolve => require(['components/apply/apply.vue'], resolve)// 按需加载
    },
    {
      path: '/applySuccess', // 报名成功
      name: 'ApplySuccess',
      meta: {
        title: '报名成功'
      },
      component: ApplySuccess
      // component: resolve => require(['components/apply/success.vue'], resolve)// 按需加载
    },
    {
      path: '/nearStore', // 附近门店
      name: 'NearStore',
      meta: {
        title: '附近门店'
      },
      component: NearStore
      // component: resolve => require(['components/near-store/near-store.vue'], resolve)// 按需加载
    },
    {
      path: '/rank', // 排名
      name: 'Rank',
      meta: {
        title: '排行榜',
        isKeepAlive: true
      },
      component: Rank
      // component: resolve => require(['components/rank/rank.vue'], resolve)// 按需加载
    },
    {
      path: '/rule', // 规则
      name: 'Rule',
      meta: {
        title: '活动规则'
      },
      component: Rule
      // component: resolve => require(['components/rule/rule.vue'], resolve)// 按需加载
    },
    {
      path: '/mine', // 我的
      name: 'Mine',
      meta: {
        title: '我的'
      },
      component: Mine
      // component: resolve => require(['components/mine/mine.vue'], resolve)// 按需加载
    },
    {
      path: '/detail/:pid/:num', // 宠物信息
      name: 'PetDetail',
      meta: {
        title: '麦田萌宠大赛'
      },
      component: PetDetail
      // component: resolve => require(['components/pet-detail/pet-detail.vue'], resolve)// 按需加载
    },
    {
      path: '/search', // 搜索
      name: 'Search',
      meta: {
        title: '搜索',
        isKeepAlive: true
      },
      component: Search
      // component: resolve => require(['components/search/search.vue'], resolve)// 按需加载
    },
    {
      path: '/activityEnd', // 活动结束
      name: 'ActivityEnd',
      meta: {
        title: '活动结束'
      },
      component: ActivityEnd
      // component: resolve => require(['components/fail/end.vue'], resolve)// 按需加载
    },
    {
      path: '/failure', // 页面失效
      name: 'Failure',
      meta: {
        title: '页面失效'
      },
      component: Failure
      // component: resolve => require(['components/fail/failure.vue'], resolve)// 按需加载
    },
    { path: '/', redirect: '/home' },
    { path: '*', redirect: '/home' }
  ],
  scrollBehavior (to, from, savedPosition) {
  //   if (savedPosition || typeof savedPosition === 'undefined') { // 从第二页返回首页时savePosition为undefined
  //     // 只处理设置了路由元信息的组件
  //     from.meta.isKeepAlive = typeof from.meta.isKeepAlive === 'undefined' ? undefined : false
  //     to.meta.isKeepAlive = typeof to.meta.isKeepAlive === 'undefined' ? undefined : true
  //     if (savedPosition) {
  //       return savedPosition
  //     }
  //   } else {
  //     from.meta.isKeepAlive = typeof from.meta.isKeepAlive === 'undefined' ? undefined : true
  //     to.meta.isKeepAlive = typeof to.meta.isKeepAlive === 'undefined' ? undefined : false
  //   }
  }
})
