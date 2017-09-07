<template>
  <div class="share">
    <div class="share-preview">
      <div class="share-box">
        <div class="close-box" @click="closePreview">
          <span class="close"></span>
        </div>
        <h3>麦田社区宠物大赛：</h3>
        <div class="logo-box">
          <p>{{petDetail.joinNumber}}号{{userNickName}}的萌宠</p>
          <img :src="'/pet/'+petDetail.petTopPic" alt="">
        </div>
        <img class="tip" src="../../assets/images/share_tip.png" alt="">
        <div  class="btn" @click="sureShare">分享</div>
      </div>
    </div>

    <div v-show="shareGuide" class="share-guide" @click="closePop">
      <share-guide></share-guide>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import ShareGuide from 'base/share/share-guide'
  export default {
    data() {
      return {
        shareGuide: false
      }
    },
    props: {
      petDetail: {
        type: Object,
        default: {}
      },
      userNickName: {
        type: String,
        default: '我'
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
    },
    components: {
      ShareGuide
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.share-preview{
  position fixed; top 0; left 0; right 0; bottom 0; z-index 99;
  width 100%; height 100%; padding 88px 38px;
  background-color rgba(0,0,0,0.8);
  .share-box{
    position relative;
    width 100%; padding 40px 0 20px;
    border-radius 16px;/*px*/
    border 4px solid rgb( 197, 139, 1 );/*px*/
    background-color: rgb( 253, 247, 221 );
    .close-box{
      position absolute; top: 10px; right 10px;
      width 80px; height 80px;
    }
    .close{
      display block;
      width 40px; height 40px; margin-left 20px; margin-top 20px;
      background-image url("../../assets/images/yes_no.png")
      background-repeat no-repeat;
      background-size 40px 80px;
      background-position 0 -40px;
    }
    h3{
      width 100%; padding 5px 0 30px;
      font-size 28px;/*px*/ color #5b3920; text-align center;
    }
    p{
      width 100%; padding-bottom 40px;
      font-size 28px;/*px*/ color #ff6f36; text-align center;
    }
    .logo-box{
      width 100%; min-height 400px;
      background-image url("../../assets/images/cheer.png")
      background-size 650px 220px;
      background-repeat no-repeat;
      background-position center 20px ;
      img{
        display block; width 400px; margin 10px auto 0;
        border 2px solid rgb( 197, 139, 1 );/*px*/
      }
    }
      .tip{
        display block;
        width 84%; max-width 560px; margin 40px auto 0;
      }
      .btn{
        position relative;
        width 144px; height 60px; margin 20px auto 0; padding-left 60px;
        border-radius 8px;/*px*/
        background-color #ff6f35;
        font-size 26px;/*px*/ color #fff; line-height 60px;
        &:before{
          content '';
          position absolute; left 10px; top 50%;
          width 40px; height 40px; margin-top -20px;
          background-image url("../../assets/images/success_icon.png");
          background-size 40px 150px;
          background-position 0 -100px;
        }
      }
  }

}
.share-guide{
  position fixed; top 0; left 0; right 0; bottom 0; z-index 100;
  width 100%; height 100%;
  background-color rgba(0,0,0,0.8);
}
</style>
