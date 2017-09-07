<template>
  <div>
    <upload-list
      v-if="showUploadList"
      :files="fileList"
      @on-file-remove="handleRemove"
      @on-file-preview="handlePreview"></upload-list>
    <div class="upload-box">
      <!-- input-->
      <!--accept="image/gif,image/jpeg,image/jpg,image/png,image/svg,video/mpeg,video/mp4"-->
      <input class="upload"
        ref="input"
        type="file"
        :accept="accept"
        :multiple="multiple"
        @change="handleChange"/>
      <slot></slot>
    </div>
    <slot name="tip"></slot>

  </div>

</template>

<script>
  import UploadList from './upload-list'
  import ajax from 'common/js/file-ajax'
  import {oneOf} from 'common/js/assist'
  import Emitter from 'common/js/emitter'
  import {MessageBox} from 'mint-ui'
  export default {
    name: 'file-upload',
    mixins: [ Emitter ],
    components: {UploadList},
    props: {
      // 占位文字
      placeholder: {
        default: '点击上传图片',
        type: String
      },
      action: {
        type: String,
        required: true
      },
      headers: {
        type: Object,
        default () {
          return {}
        }
      },
      multiple: {
        type: Boolean,
        default: false
      },
      data: {
        type: Object
      },
      name: {
        type: String,
        default: 'file'
      },
      withCredentials: {
        type: Boolean,
        default: false
      },
      showUploadList: {
        type: Boolean,
        default: true
      },
      type: {
        type: String,
        validator (value) {
          return oneOf(value, ['select', 'drag'])
        },
        default: 'select'
      },
      format: {
        type: Array,
        default () {
          return []
        }
      },
      accept: {
        type: String
      },
      maxSize: {
        type: Number
      },
      beforeUpload: Function,
      onProgress: {
        type: Function,
        default () {
          return {}
        }
      },
      onSuccess: {
        type: Function,
        default () {
          return {}
        }
      },
      onError: {
        type: Function,
        default () {
          return {}
        }
      },
      onRemove: {
        type: Function,
        default () {
          return {}
        }
      },
      onPreview: {
        type: Function,
        default () {
          return {}
        }
      },
      onExceededSize: {
        type: Function,
        default () {
          return {}
        }
      },
      onFormatError: {
        type: Function,
        default () {
          return {}
        }
      },
      defaultFileList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data () {
      return {
        fileList: [],
        tempIndex: 1
      }
    },
    computed: {
      // 是否有图片
      hasImages () {
        return this.imageDataList.length > 0
      },
      // 格式化的文件大小，可读的
      sizeFormatted () {
        let result = 0
        if (this.maxSize < 1024) {
          result = this.maxSize + 'K'
        } else {
          result = (this.maxSize / 1024).toFixed(this.maxSize % 1024 > 0 ? 2 : 0) + 'M'
        }
        return result
      }
    },
    mounted () {
    },
    filters: {
    },
    methods: {
      handleClick () {
        this.$refs.input.click()
      },
      handleChange (e) {
        const files = e.target.files
        if (!files) {
          return
        }
        this.uploadFiles(files)
        this.$refs.input.value = null
      },
      uploadFiles (files) {
        let postFiles = Array.prototype.slice.call(files)
        if (!this.multiple) postFiles = postFiles.slice(0, 1)
        if (postFiles.length === 0) return
        postFiles.forEach(file => {
          this.upload(file)
        })
      },
      upload (file) {
        if (this.name === 'petVideo') {
          MessageBox.confirm('视频文件最大支持50MB，请确认后再上传').then(action => {
            console.log(action)
            if (action === 'confirm') {
              if (!this.beforeUpload) {
                return this.post(file)
              }
              const before = this.beforeUpload(file)
              if (before && before.then) {
                before.then(processedFile => {
                  if (Object.prototype.toString.call(processedFile) === '[object File]') {
                    this.post(processedFile)
                  } else {
                    this.post(file)
                  }
                }, () => {
                  // this.$emit('cancel', file);
                })
              } else if (before !== false) {
                this.post(file)
              } else {
                // this.$emit('cancel', file);
              }
            }
          }).catch(action => {
            console.log(action)
            return false
          })
        } else {
          if (!this.beforeUpload) {
            return this.post(file)
          }
          const before = this.beforeUpload(file)
          if (before && before.then) {
            before.then(processedFile => {
              if (Object.prototype.toString.call(processedFile) === '[object File]') {
                this.post(processedFile)
              } else {
                this.post(file)
              }
            }, () => {
              // this.$emit('cancel', file);
            })
          } else if (before !== false) {
            this.post(file)
          } else {
            // this.$emit('cancel', file);
          }
        }
      },
      post (file) {
        // check format
        if (this.format.length) {
          const fileFormat = file.name.split('.').pop().toLocaleLowerCase()
          const checked = this.format.some(item => item.toLocaleLowerCase() === fileFormat)
          if (!checked) {
            this.onFormatError(file, this.fileList)
            return false
          }
        }
        // check maxSize
        if (this.maxSize) {
          if (file.size > this.maxSize * 1024) {
            this.onExceededSize(file, this.fileList)
            return false
          }
        }
        this.handleStart(file)
        let formData = new FormData()
        formData.append(this.name, file)
        ajax({
          headers: this.headers,
          withCredentials: this.withCredentials,
          file: file,
          data: this.data,
          filename: this.name,
          action: this.action,
          onProgress: e => {
            this.handleProgress(e, file)
          },
          onSuccess: res => {
            this.handleSuccess(res, file)
          },
          onError: (err, response) => {
            this.handleError(err, response, file)
          }
        })
      },
      handleStart (file) {
        file.uid = Date.now() + this.tempIndex++
        const _file = {
          status: 'uploading',
          name: file.name,
          size: file.size,
          percentage: 0,
          uid: file.uid,
          showProgress: true
        }
        this.fileList.push(_file)
      },
      getFile (file) {
        const fileList = this.fileList
        let target
        fileList.every(item => {
          target = file.uid === item.uid ? item : null
          return !target
        })
        return target
      },
      handleProgress (e, file) {
        const _file = this.getFile(file)
        this.onProgress(e, _file, this.fileList)
        _file.percentage = e.percent || 0
      },
      handleSuccess (res, file) {
        if (res.status === '1') {
          const _file = this.getFile(file)
          if (_file) {
            _file.status = 'finished'
            if (this.name === 'petPic') {
              _file.thumAddress = res.data[0].petPicMap.thumAddress
              _file.picAddress = res.data[0].petPicMap.picAddress
              _file.picFlag = res.data[0].petPicMap.picFlag
            } else if (this.name === 'petVideo') {
              _file.videoAddress = res.data[0].petVideoUrl.videoAddress
              _file.videoFrame = res.data[0].petVideoUrl.videoFrame
              _file.videoFlag = res.data[0].petVideoUrl.videoFlag
            } else {
              _file.response = res
            }
            this.dispatch('FormItem', 'on-form-change', _file)
//            alert(_file.status)
            this.onSuccess(res, _file, this.fileList)
            setTimeout(() => {
              _file.showProgress = false
            }, 1000)
          }
        }
      },
      handleError (err, response, file) {
        const _file = this.getFile(file)
        const fileList = this.fileList
        _file.status = 'fail'
        fileList.splice(fileList.indexOf(_file), 1)
        this.onError(err, response, file)
      },
      handleRemove(file) {
        const fileList = this.fileList
        fileList.splice(fileList.indexOf(file), 1)
        this.onRemove(file, fileList)
      },
      handlePreview(file) {
        if (file.status === 'finished') {
          this.onPreview(file)
        }
      },
      clearFiles() {
        this.fileList = []
      }
    },
    watch: {
      defaultFileList: {
        immediate: true,
        handler(fileList) {
          console.log(fileList)
          this.fileList = fileList.map(item => {
            item.status = 'finished'
            item.percentage = 100
            item.uid = Date.now() + this.tempIndex++
            return item
          })
          if (this.fileList.length > 0) {
            this.$emit('repeat-get-file', this.fileList)
          }
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .upload-box{
    position: relative;
  }
  .upload{
    position: absolute; width: 100%; height: 100%;
    left: 0; right: 0;
    top:0; bottom: 0; z-index: 2;
    filter:alpha(opacity=0);
    opacity:0;
  }
</style>
