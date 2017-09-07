<template>
  <div id="app" v-wechat-title="myTitle">
    <!--<img src="./assets/logo.png">-->
    <!--<router-view v-wechat-title="myTitle"></router-view>-->
    <!--<keep-alive>-->
      <!--<router-view v-if="$route.meta.isKeepAlive"></router-view>-->
    <!--</keep-alive>-->
    <!--<router-view v-if="!$route.meta.isKeepAlive"></router-view>-->
    <router-view></router-view>
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
  html,body{height:100%;}
  #app {
    /*position: fixed;top: 0; bottom: 0;left: 0;right: 0; z-index: 1;*/
    width:100%; height:100%;
    /*overflow-y: auto;*/
  }
  [v-cloak]{ display: none; }

</style>
