<template>
  <div id="app" v-wechat-title="myTitle">
    <!--<img src="./assets/logo.png">-->
    <!--<router-view v-wechat-title="myTitle"></router-view>-->
    <transition name="router-fade" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.isKeepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="router-fade" mode="out-in">
      <router-view v-if="!$route.meta.isKeepAlive"></router-view>
    </transition>

    <!--<router-view></router-view>-->
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
      }
    },
    computed: {
      myTitle() {
        return this.$route.name === 'PetDetail' ? this.$route.meta.title + this.$route.params.num + '号' : this.$route.meta.title
      }
    },
    mounted() {
    },
    methods: {
      editTitleTag(text) {
        document.querySelector('title').innerText = text
      }
    }
  }
</script>

<style>
  .router-fade-enter-active, .router-fade-leave-active {
    transition: opacity .3s;
  }
  .router-fade-enter, .router-fade-leave-active {
    opacity: 0;
  }
  html,body{height:100%;}
  #app {
    /*position: fixed;top: 0; bottom: 0;left: 0;right: 0; z-index: 1;*/
    width:100%; height:100%;
    /*overflow-y: auto;*/
  }
  [v-cloak]{ display: none; }
  #loading{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background-color: #fff;
  }
  #loading:before{
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    height: 24px;
    width: 24px;
    margin-top: -12px;
    margin-left: -12px;
    background-color: #fff;
    background: url("/static/loading.gif") no-repeat;
    background-size: 100% 100%;
  }

</style>
