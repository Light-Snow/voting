<template>
  <div class="guide">
    <img src="../../assets/images/share_pop.png" alt="">
  </div>

</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        shareGuide: false
      }
    },
    mounted() {
    },
    computed: {
    },
    methods: {
      sureShare() {
        this.shareGuide = true
      },
      closePreview() {
        this.$emit('isShare', false)
      },
      closePop() {
        this.shareGuide = false
        this.$emit('isShare', false)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .guide{
    width 100%;
    img{
      display block; width 80%; max-width 510px; margin 0 auto;
    }
  }
</style>
