<template>
  <div class="mine-not">
    <div class="not-apply">
      <img src="../../assets/images/mine_img.jpg" alt="">
      <ul class="name-code">
        <li>账户名称：{{nickName}}</li>
        <li>参赛编号：未参赛</li>
      </ul>
    </div>
    <div class="go-apply" @click="goApply">
      <img src="../../assets/images/go_apply.png" alt="">
    </div>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui'
  export default {
    name: 'mine-not',
    data () {
      return {
      }
    },
    props: {
      nickName: {
        type: String,
        default: '麦田守望者'
      },
      isExpire: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
    },
    computed: {
    },
    methods: {
      goApply() {
        if (!this.isExpire) {
          this.$router.push({name: 'Apply'})
        } else {
          Toast('活动到期,将不能报名')
        }
      }
    },
    components: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  .mine-not{
    .not-apply{
      position relative;
      width 100%;
      img{
        display block; width 100%; min-height 513px;
      }
        .name-code{
          position absolute; top 70%; left 0;
          width 100%;
          li{
            width 100%; height 76px; line-height 76px; padding 0 26px;
            border-bottom  2px solid #fff;/*px*/
            font-size 28px;/*px*/ color #fff;
            text-overflow: ellipsis
            overflow: hidden
            white-space: nowrap
            &:last-of-type{
              border-bottom none;
            }
          }
        }
    }
      .go-apply{
        display block;
        width 320px; height 80px; margin 40px auto;
        img{
          display block; width 100%;
        }
      }
  }
</style>
