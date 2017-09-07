<template>

  <div class="upload">
    <!--<input type="file" accept="image/gif,image/jpg,image/svg,image/jpeg,image/png,image/tiff,video/mpeg,video/mp4,audio/mp4" multiple @change="acceptFile" ref="inputer">-->
    <!--<img :src="dataUrl" />-->
    <div class="demo-upload-list" v-for="item in uploadList">
      <template v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="demo-upload-list-cover">
          <i class="icon-ioseyeoutline" @click.native="handleView(item.name)"></i>
          <i class="icon-ioscloseoutline" @click.native="handleRemove(item)"></i>
        </div>
      </template>
      <template v-else>
        <mt-progress v-if="item.showProgress" :value="item.percentage"></mt-progress>
      </template>
    </div>
    <file-upload ref="upload"
                 :max-size="maxSize"
                 action=""
                 :default-file-list="defaultList"
                 :format="['jpg','jpeg','png']"
    >
      <p class="img-uploader-placeholder" >
        点击上传视频或图片（5/5）
        <span>(网络颠簸，建议单个附件不超过5M)</span>
      </p>
    </file-upload>
    <!--<ul>-->
      <!--<li v-for="(item,index) in fileList">-->
        <!--{{item.name}}-->
        <!--<a href="javascript:" @click="deleteFile(index)">删除</a>-->
      <!--</li>-->
    <!--</ul>-->


  </div>
</template>

<script>
  import FileUpload from 'base/file-upload/file-upload'
  export default {
    name: 'upload',
    data () {
      return {
        src: '/static/video/150716YesMen_synd_768k_vp8.webm',
        // 转base64码后的data字段
        dataUrl: '',
        maxSize: 5120,
        fileList: [],
        defaultList: [
          {
            'name': 'a42bdcc1178e62b4694c830f028db5c0',
            'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
          },
          {
            'name': 'bc7521e033abdd1e92222d733590f104',
            'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
          }
        ],
        imgName: '',
        visible: false,
        uploadList: []
//        headers: {'Access-Control-Allow-Origin': '*'}
      }
    },
    computed: {
    },
    methods: {
      handleView (name) {
        this.imgName = name
        this.visible = true
      },
      handleRemove (file) {
        // 从 upload 实例删除数据
        const fileList = this.$refs.upload.fileList
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      },
      handleSuccess (res, file) {
        // 因为上传过程为实例，这里模拟添加 url
        file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
        file.name = '7eb99afb9d5f317c912f08b5212fd69a'
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
        })
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
        })
      },
      handleBeforeUpload () {
        const check = this.uploadList.length < 5
        if (!check) {
          this.$Notice.warning({
            title: '最多只能上传 5 张图片。'
          })
        }
        return check
      },
      imgPreview (file) {
        let self = this
        // 看支持不支持FileReader
        if (!file || !window.FileReader) return

        if (/^image/.test(file.type)) {
          // 创建一个reader
          var reader = new FileReader()
          // 将图片将转成 base64 格式
          reader.readAsDataURL(file)
          // 读取成功后的回调
          reader.onloadend = function () {
            self.dataUrl = this.result
          }
        }
      },
      acceptFile(e) {
        console.log(e.target.value)
        console.log(e.target.files)
        let inputDOM = this.$refs.inputer
        // 通过DOM取文件数据
        this.file = inputDOM.files[0]
        this.errText = ''

        let size = Math.floor(this.file.size / 1024)
        if (size > 2048) {
          // 这里可以加个文件大小控制
          return false
        }

        // 触发这个组件对象的input事件
        this.$emit('input', this.file)

        // 这里就可以获取到文件的名字了
        this.fileName = this.file.name

        // 这里加个回调也是可以的
        this.onChange && this.onChange(this.file, inputDOM.value)
        console.log(this.file)
        this.imgPreview(this.file)
      }
    },
    components: {
      FileUpload
    },
    mounted () {
      this.uploadList = this.$refs.upload.fileList
      console.log(this.$refs.upload)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.demo-upload-list{
  display: inline-block;
  width: 160px;
  height: 160px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  margin-right: 4px;
}
.demo-upload-list img{
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover{
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
  display: block;
}
.demo-upload-list-cover i{
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.demo-upload-list-cover svg{
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
