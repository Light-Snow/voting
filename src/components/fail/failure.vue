<template>
  <div class="lose">
    页面已经过期，请从微信重新进入
  </div>
</template>

<script>
  export default {
    name: 'lose',
    data () {
      return {
        msg: '页面失效'
      }
    },
    mounted() {
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
  .lose{
    width: 100%; height: 100%;
    padding: 50px 40px;
    font-size: 28px;/*px*/ text-align: center; line-height: 44px;/*px*/
    color: #999;
  }
</style>
