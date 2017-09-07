<template>
  <div class="tab-box">
    <div class="tab">
      <router-link tag="div" class="tab-item" to="/home">
        <span class="tab-link home"></span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/rank">
        <span class="tab-link rank"></span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/rule">
        <span class="tab-link rule"></span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/mine">
        <span class="tab-link mine"></span>
      </router-link>
    </div>
    <img class="logo" src="../../assets/images/bottom_icon.png"/>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .tab-box
    position: fixed
    left:0
    bottom : 0
    z-index 99
    width :100%
    height: 92px
    background-image :url("../../assets/images/bottom_bg.png")
    background-repeat no-repeat
    background-size 100% 100%
    background-position center
    .logo
      position absolute
      left 50%
      top -40px
      width 80px
      height 80px
      margin-left -40px
  .tab
    display: flex
    height: 92px
    line-height: 44px
    font-size: $font-size-medium
    .tab-item
      flex: 1
      text-align: center
      .tab-link
        display block
        width 70px
        height 70px
        margin 10px auto
        background-image url("../../assets/images/tab_icon.png")
        background-repeat no-repeat
        background-size 720px 90px
        &.home
          background-position -10px -10px
        &.rank
          background-position -100px -10px
        &.rule
          background-position -190px -10px
        &.mine
          background-position -280px -10px
      &.router-link-active
        .tab-link
          margin-top 8px
          &.home
           background-position -370px -10px
          &.rank
            background-position -460px -10px
          &.rule
            background-position -550px -10px
          &.mine
            background-position -640px -10px
</style>
