<template>
  <ul class="clearFix">
    <li class="upload-list"
      v-for="file in files"
      @click="handleClick(file)">
      <img :src="'/pet/'+file.picAddress" alt="" @click="handlePreview(file)">
      <i class="close-icon" @click="handleRemove(file)">×</i>
      <transition name="fade">
        <mt-progress
          v-if="file.showProgress"
          :bar-height="2"
          :value="parsePercentage(file.percentage)"></mt-progress>
      </transition>
    </li>
  </ul>
</template>
<script>
  export default {
    name: 'UploadList',
//    components: { iProgress.name, iProgress },
    props: {
      files: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data () {
      return {
      }
    },
    methods: {
      handleClick (file) {
        this.$emit('on-file-click', file)
      },
      handlePreview (file) {
        this.$emit('on-file-preview', file)
      },
      handleRemove (file) {
        this.$emit('on-file-remove', file)
      },
      format (file) {
        const format = file.name.split('.').pop().toLocaleLowerCase() || ''
        let type = 'document'
        if (['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'].indexOf(format) > -1) {
          type = 'image'
        }
        if (['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'].indexOf(format) > -1) {
          type = 'ios-film'
        }
        if (['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac'].indexOf(format) > -1) {
          type = 'ios-musical-notes'
        }
        if (['doc', 'txt', 'docx', 'pages', 'epub', 'pdf'].indexOf(format) > -1) {
          type = 'document-text'
        }
        if (['numbers', 'csv', 'xls', 'xlsx'].indexOf(format) > -1) {
          type = 'stats-bars'
        }
        if (['keynote', 'ppt', 'pptx'].indexOf(format) > -1) {
          type = 'ios-videocam'
        }
        return type
      },
      parsePercentage (val) {
        return parseInt(val, 10)
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .upload-list{
    position relative;
    float left; width 130px; height auto;min-height 130px; border 8px solid #ff6631;/*px*/
    border-radius 8px;/*px*/ margin-right 40px; margin-bottom 20px;
  &:nth-of-type(4n){
     margin-right 0;
   }
  img{
    display block; width 100%;
  }
  .close-icon{
    position absolute;
    top:-20px;/*px*/  right -20px;/*px*/
    width 40px;/*px*/ height 40px;/*px*/ line-height 36px;/*px*/
    border 2px solid #fff;/*px*/ border-radius 50%;
    font-size 28px;/*px*/ text-align center; color #fff; font-style normal;
    background-color #ff6631;
  }
  }
</style>
