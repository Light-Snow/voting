<template>
  <div class="review-mask">
    <dl>
      <dt></dt>
      <dd>审核中......</dd>
    </dl>
  </div>

</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
      }
    },
    methods: {
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .review-mask{
    position absolute; top 0; left 0; right 0; bottom 0; z-index 10;
    width 100%; height 100%;
    background-color rgba(77,85,99,0.8)
    dl{
      position absolute; top 50%; left 50%;
      width 200px; height 100px;
      margin-left -100px; margin-top -50px;
      dt{
        width 40px; height 40px; margin 0 auto;
        background-image url("../../assets/images/review_icon.png")
        background-size 40px 40px;
        background-repeat no-repeat;
      }
      dd{
        padding-left 20px;
        font-size 28px;/*px*/  color #fff; text-align center; line-height 60px;
      }
    }
  }
</style>
