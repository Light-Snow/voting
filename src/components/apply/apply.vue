<template>
  <div class="apply">
    <div class="apply-top"></div>
    <!--<img class="apply-top" src="../../assets/images/apply_top.jpg" alt="">-->
    <div class="apply-con">
      <div class="apply-form">
        <div class="form-item">
          <label>手机号：</label>
          <div class="form-right clearFix">
            <div class="clearFix">
              <div class="input-box" :class="{'right': verifyPhone==='1' ,'error': verifyPhone==='0'}">
                <input class="phone"  type="tel" v-model.trim="phone" placeholder="必填"
                       @blur="checkPhone"
                       @focus="focusInput" :disabled="notEdit">
                <i></i>
              </div>
              <input v-show="time<=0" class="send-code" type="button" value="发送验证码" @click="sendCode" :disabled="notEdit">
              <input v-show="time>0" class="send-code" type="button" v-model="timeText">
            </div>
            <div class="input-box" :class="{'right': verifyCode==='1' ,'error': verifyCode==='0'}">
              <input type="text" v-model.trim="code" placeholder="填写验证码" @blur="checkCode" @focus="focusInput" maxlength="4" :disabled="notEdit">
              <i class="yes" v-if="code"></i>
              <i class="no" v-else></i>
            </div>
          </div>
        </div>
        <div class="form-item">
          <label>宠物标签：</label>
          <div class="form-right select-box clearFix">
            <span class="wang" :class="{'active':belongTag==='1'}" @click="selectTag('1')"><i>汪星人</i></span>
            <span class="miao" :class="{'active':belongTag==='2'}" @click="selectTag('2')"><i>喵星人</i></span>
            <span class="other" :class="{'active':belongTag==='3'}" @click="selectTag('3')"><i>其他</i></span>
          </div>
        </div>
        <div class="form-item">
          <label>宠物介绍：</label>
          <div class="form-right">
            <textarea name="introduce" rows="4" v-model="petIntroduce" maxlength="100"></textarea>
          </div>
        </div>
      </div>
      <div class="apply-btn" @click="applyWork"></div>
    </div>
    <div class="file-box">
      <div class="clearFix">
        <div class="upload-list" v-for="item in petPicList" v-if="petPicList.length>0">
          <template v-if="item.status === 'finished'">
            <div class="img-box">
              <img :src="'/pet/'+item.picAddress">
            </div>
            <i class="close-icon" @click="handleRemovePic(item)">×</i>
          </template>
          <template v-else>
            <mt-progress  class="progress" :bar-height="4" v-if="item.showProgress" :value="item.percentage"></mt-progress>
          </template>
        </div>
        <div class="upload-list" v-for="item in petVideoList"  v-if="petVideoList.length>0">
          <template v-if="item.status === 'finished'">
            <div class="img-box">
              <img :src="'/pet/'+item.videoFrame">
            </div>
            <i class="close-icon" @click="handleRemoveVideo(item)">×</i>
          </template>
          <template v-else>
            <mt-progress class="progress" :bar-height="4" v-if="item.showProgress" :value="item.percentage"></mt-progress>
          </template>
        </div>
        <div class="upload-list" v-show="totalFileNum<5">
          <file-upload ref="uploadPic"
                       :show-upload-list="false"
                       :default-file-list="defaultPicList"
                       :on-success="handleSuccess"
                       :on-remove="handleRemovePic"
                       :max-size="maxSize"
                       :on-format-error="handleFormatErrorPic"
                       :on-exceeded-size="handleMaxSize"
                       :before-upload="handleBeforeUpload"
                       action="/pet/api/pet.do?method=photoVideoUpLoad"
                       :format="['jpg','jpeg','png']"
                       :accept="imgAccept"
                       name="petPic"
                       @repeat-get-file="repeatGetFile"
          >
            <div class="img-box">
              <img src="../../assets/images/picture.png">
            </div>
          </file-upload>
        </div>
        <div class="upload-list"  v-show="totalFileNum<5&& petVideoList.length<1">
          <file-upload ref="uploadVideo"
                       :show-upload-list="false"
                       :default-file-list="defaultVideoList"
                       :on-success="handleSuccessVideo"
                       :max-size="videoMaxSize"
                       :on-format-error="handleFormatErrorVideo"
                       :on-exceeded-size="handleMaxSizeVideo"
                       :before-upload="handleBeforeUploadVideo"
                       action="http://pet.maitian.cn/pet/api/pet.do?method=photoVideoUpLoad"
                       :accept="videoAccept"
                       :format="['mov','mp4']"
                       name="petVideo"
                       @repeat-get-file="repeatGetFile"
          >
            <div class="img-box">
              <img src="../../assets/images/video.png">
            </div>
          </file-upload>
        </div>
      </div>
      <div class="tip-box">
        <p>上传宠物视频或图片（{{totalFileNum}}/5）</p>
        <p><span>(网络颠簸，请上传时控制单个图片不超过5M，视频不超过50M)</span></p>
      </div>
    </div>

  </div>
</template>

<script>
  import FileUpload from 'base/file-upload/file-upload'
  import commonApi from 'common/js/http'
//  import {ToCDB} from 'common/js/assist'
  import { Toast } from 'mint-ui'
  import wxShare from 'common/js/wxconfig'
  export default {
    name: 'home',
    data () {
      return {
        notEdit: false,
        applying: false, // 发布作品中
        petId: '', // 宠物作品Id
        activityIntroduceText: '', // 活动文案
        activityId: '', // 活动Id
        phone: '',
        code: '',
        belongTag: '3', // 宠物标签（1代表汪星人，2代表喵星人，3代表其它,全部为空）
        petIntroduce: '这是我家爱宠，喜欢它，就投票吧！',
        petPicList: [],
        petVideoList: [],
        maxSize: 5120,
        videoMaxSize: 51200,
        imgAccept: 'image/gif,image/jpeg,image/jpg,image/png',
        videoAccept: 'video/quicktime，video/x-msvideo,video/mp4',
//        videoAccept: '.mp4,.mov',
        picUploading: false,
        videoUploading: false,
        defaultPicList: [],
        defaultVideoList: [],
        verifyPhone: '2', // 1代表验证通过，0代表没通过，2代表没有验证
        verifyCode: '2', // 1代表验证通过，0代表没通过，2代表没有验证
        userOpenId: '',
        userNickName: '',
        clickSend: false,
        time: 0 // 时间
      }
    },
    mounted() {
      this.petId = this.$route.query.petId
      this.petPicList = this.$refs.uploadPic.fileList
      this.petVideoList = this.$refs.uploadVideo.fileList
      this.getOpenId() // 获取openId
      this.$nextTick(function () {
        this.getActivityInfo() // 获取活动信息
      })
    },
    computed: {
      timeText() {
        if (this.time > 0) {
          return this.time + 's'
        }
      },
      totalFileNum() {
        console.log(this.petPicList.length, this.petVideoList.length)
        return this.petPicList.length + this.petVideoList.length
      }
    },
    methods: {
      repeatGetFile() {
        console.log('11111')
        this.petPicList = this.$refs.uploadPic.fileList
        this.petVideoList = this.$refs.uploadVideo.fileList
      },
      getOpenId() {
        const params = {
          method: 'getOpenId'
        }
        commonApi.postApi('/pet/api/pet.do', params).then((res) => {
          console.log(res.data)
          if (res.data.status === '1') {
            let wxInfo = res.data.data
            this.userOpenId = wxInfo.openId
            this.userNickName = wxInfo.nickname
            this.getPetDetail() // 获取宠物信息
          } else if (res.data.status === '-1') {
            this.$router.replace({name: 'Failure'})
          } else {
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getActivityInfo() {
        const params = {
          method: 'findAvailablePetActivity',
          activityId: this.activityId
        }
        commonApi.postApi('/pet/api/pet.do', params).then((res) => {
          console.log(res.data)
          if (res.data.status === '-1') {
            this.$router.replace({name: 'Failure'})
          } else if (res.data.status === '1') {
            this.activityId = res.data.data.id
            this.activityIntroduceText = res.data.data.activityIntroduceText
            let gzTopLogo = res.data.data.gzTopLogo
            this.getIndexShareData(gzTopLogo) // 分享首页
          } else if (res.data.status === '2') {
            Toast('活动到期,将不能报名')
            this.activityId = res.data.data.id
            this.$router.push({name: 'Home'})
          } else {
//            Toast('活动结束')
            this.$router.replace({name: 'ActivityEnd'})
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getIndexShareData(gzTopLogo) {
//        console.log(gzTopLogo)
        const params = {
          method: 'getIndexShareUrl'
        }
        commonApi.postApi('/pet/api/pet.do', params).then((res) => {
//          console.log(res.data)
          if (res.data.status === '1') {
            let shareUrl = res.data.data
//            console.log(shareUrl)
            let shareObj = {
              shareTitle: '麦田萌宠评选',
              shareDesc: this.activityIntroduceText,
              shareUrl: shareUrl,
              shareImg: gzTopLogo
            }
//            console.log(shareObj)
            let currentUrl = location.href.split('#')[0]
            wxShare(shareObj, currentUrl) // 微信分享
          } else if (res.data.status === '-1') {
            this.$router.replace({name: 'Failure'})
          } else {
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getPetDetail() {
        if (this.petId && this.petId.length > 0) {
          const params = {
            method: 'findpetDetail',
            petId: this.petId,
            voterOpenId: this.userOpenId
          }
//          alert(JSON.stringify(params))
          commonApi.postApi('/pet/api/pet.do', params).then((res) => {
            console.log(res.data)
//            alert(res.data.status)
            if (res.data.status === '1') {
              let _this = this
              this.notEdit = true
              let petDetail = res.data.data.petDetail
              this.phone = petDetail.mobile || ''
              this.petIntroduce = petDetail.introduce || '这是我家爱宠，喜欢它，就投票吧！'
              this.belongTag = petDetail.belongTag || '3'
              let petPicList = res.data.data.petPicList // 图片列表
              console.log(petPicList)
              if (petPicList.length > 0) {
                this.defaultPicList = petPicList
                for (let i = 0; i < petPicList.length; i++) {
                  _this.defaultPicList[i].status = 'finished'
                }
              }
              console.log(this.defaultPicList)
              console.log(this.$refs.uploadPic.fileList)
              if (res.data.data.petVideoList) {
                let petVideoList = res.data.data.petVideoList
                if (petVideoList.length > 0) {
                  this.defaultVideoList = petVideoList
                  for (let i = 0; i < this.defaultVideoList.length; i++) {
                    _this.defaultVideoList[i].videoFlag = '0'
                    _this.defaultVideoList[i].status = 'finished'
                  }
                }
              }
//              this.petPicList = this.$refs.uploadPic.fileList
//              this.petVideoList = this.$refs.uploadVideo.fileList
            } else if (res.data.status === '-1') {
              this.$router.replace({name: 'Failure'})
            } else {
              Toast('宠物信息获取失败，您需重新发布')
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      },
      selectTag(tag) {
        this.belongTag = tag
      },
      checkPhone() {
        let pattern = /^0{0,1}(1[0-9][0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/
        let testPhone = pattern.test(this.phone)
        if (!testPhone) {
          this.verifyPhone = '0'
        } else {
          this.verifyPhone = '1'
        }
      },
      checkCode() {
        let reg = /^\d{4}$/
        let testCode = reg.test(this.code)
        if (!testCode) {
          this.verifyCode = '0'
        } else {
          this.verifyCode = '1'
        }
      },
      focusInput() {
        this.verifyPhone = '2'
        this.verifyCode = '2'
      },
      sendCode() {
        this.checkPhone() // 再次检查手机号
        if (this.verifyPhone === '1') {
          if (!this.clickSend) {
            this.clickSend = true
            commonApi.postApi('/pet/api/pet.do', {
              method: 'mobileMsgSend',
              mobile: this.phone,
              openId: this.userOpenId,
              activityId: this.activityId
            }).then((res) => {
              console.log(res.data)
              this.clickSend = false
              if (res.data.status === '1') {
                this.time = 120
                this.timer()
              } else if (res.data.status === '2') {
                Toast('您今日发送短信条数已超过10条')
              } else if (res.data.status === '-1') {
                this.$router.replace({name: 'Failure'})
              }
            }).catch((error) => {
              this.clickSend = false
              console.log(error)
            })
          } else {
            Toast('验证码发送中')
          }
        } else {
          Toast('请输入正确手机号')
        }
      },
      timer: function () {
        if (this.time > 0) {
          this.time--
          setTimeout(this.timer, 1000)
//          console.log(this.time)
        }
      },
      applyWork() {
        let petIntroduce = escape(this.petIntroduce)
        this.checkPhone() // 再次检查手机号
        if (this.verifyPhone !== '1') {
          this.verifyPhone = '0'
          Toast('请检查手机号是否输入正确')
          return false
        } else if (this.totalFileNum < 5) {
          Toast('图片和视频文件必须达到5个')
          return false
        } else if (this.picUploading) {
          Toast('请将图片上传完毕后再发布作品')
          return false
        } else if (this.videoUploading) {
          Toast('请将视频上传完毕后再发布作品')
          return false
        } else {
          let applyPicList = JSON.stringify(this.petPicList)
          let applyVideoList = ''
          if (this.petVideoList.length > 0) {
            applyVideoList = JSON.stringify(this.petVideoList)
          }
          const params = {
            method: 'addPetDetail',
            petId: this.petId,
            mobile: this.phone,
            openId: this.userOpenId,
            belongTag: this.belongTag,
            introduce: petIntroduce,
            petPicMap: applyPicList,
            petVideoMap: applyVideoList,
            verifyCode: this.code,
            userNickname: this.userNickName
          }
          console.log(params)
          if (!this.applying) {
            this.applying = true
            commonApi.postApi('/pet/api/pet.do', params).then((res) => {
              this.applying = false
              console.log(res.data)
              if (res.data.status === '1') {
                Toast('发布成功')
                this.$router.replace({name: 'ApplySuccess'})
              } else if ((res.data.status === '2')) {
                Toast('验证码不正确')
              } else if ((res.data.status === '3')) {
                Toast('手机号和验证码不一致')
              } else if ((res.data.status === '4')) {
                Toast('图片或者视频上传不够5个')
              } else if ((res.data.status === '5')) {
                Toast('验证码失效')
              } else if ((res.data.status === '6')) {
                Toast('手机验证码信息为空')
              } else if ((res.data.status === '7')) {
                Toast('作品已存在，请不要重复添加')
                this.$router.replace({name: 'Home'})
              } else if (res.data.status === '-1') {
                this.$router.replace({name: 'Failure'})
              } else {
                Toast('发布失败')
              }
            }).catch((error) => {
              this.applying = false
              console.log(error)
            })
          }
        }
      },
      handleRemovePic (file) {
        // 从 upload 实例删除数据
        const fileList = this.$refs.uploadPic.fileList
        this.$refs.uploadPic.fileList.splice(fileList.indexOf(file), 1)
//          this.petPicList.splice(this.petPicList.indexOf(file), 1)
        console.log(this.petPicList)
        Toast('删除图片成功')
      },
      handleRemoveVideo (file) {
        // 从 upload 实例删除数据
        const fileList = this.$refs.uploadVideo.fileList
        this.$refs.uploadVideo.fileList.splice(fileList.indexOf(file), 1)
//          this.petVideoList.splice(this.petVideoList.indexOf(file), 1)
        console.log(this.petVideoList)
        Toast('删除视频成功')
      },
      handleSuccess (res, file, fileList) {
        this.picUploading = false // 图片上传结束
        this.petPicList = fileList
//        console.log(fileList)
//        console.log(this.petPicList)
//        console.log(this.petVideoList)
      },
      handleSuccessVideo (res, file, fileList) {
        this.videoUploading = false // 视频上传结束
        this.petVideoList = fileList
        console.log(this.petVideoList)
        // 因为上传过程为实例，这里模拟添加 url
      },
      handleFormatErrorPic (file) {
        this.picUploading = false // 图片上传结束
        Toast('文件格式不正确,请上传 jpg 或 png 格式的图片')
      },
      handleFormatErrorVideo (file) {
        this.videoUploading = false // 视频上传结束
        Toast('文件格式不正确,请上传 mov 或 mp4 格式的视频')
      },
      handleMaxSize (file) {
        this.picUploading = false // 图片上传结束
        Toast('图片文件太大，不能超过 5M')
      },
      handleMaxSizeVideo (file) {
        this.videoUploading = false // 视频上传结束
        Toast('视频文件太大，不能超过 50M')
      },
      handleBeforeUpload () {
        this.picUploading = true // 图片将进入上传中
        console.log(this.petPicList.length)
        console.log(this.petVideoList.length)
        if (this.petVideoList.length === 1) {
          const check = this.petPicList.length < 4
          if (!check) {
            Toast('最多只能上传4张图片和1个视频')
          }
          return check
        } else {
          const check = this.petPicList.length < 5
          if (!check) {
            Toast('最多只能上传5张图片')
          }
          return check
        }
      },
      handleBeforeUploadVideo () {
        this.videoUploading = true // 视频上传中
//        console.log(this.petPicList.length)
//        console.log(this.petVideoList.length)
        if (this.petPicList.length >= 5) {
          Toast('您已上传5张图片,将不能再上传视频')
          return false
        } else {
          const check = this.petVideoList.length < 1
          if (!check) {
            Toast('最多只能上传1个视频')
          }
          return check
        }
      }
    },
    components: {
      FileUpload
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  .apply{
    width 100%; min-height 100%;
    background-image url("../../assets/images/home_bg.png")
    background-repeat repeat-y;
    background-size 100% auto;
    .apply-top{
      display block; width 100%;height 375px;
      background-image url("../../assets/images/apply_top.jpg")
      background-repeat repeat-y;
      background-size 100% 100%;
    }
    .apply-con{
      width 100%; padding 0 7.1%;
      .apply-form{
        border-radius 0 0 16px 16px;/*px*/
        background-color #ffbf25;
        .form-item{
          position relative;
          width 100%; padding-bottom 60px;
          label{
            position absolute; left 0; top 0; z-index 2; width 190px;
            font-size 30px;/*px*/ color #2b2b2b; text-align right; line-height 60px;
          }
          .form-right{
            width 100%; padding-left 195px;
            .input-box{
              position relative;
              float left; margin-bottom 20px;
              &.right{
                i{
                  display block
                  background-position 0 0;
                }
              }
              &.error{
                input{
                  border 4px solid red;/*px*/
                }
                i{
                  display block
                  background-position 0 -40px;
                }
              }
              i{
                display none;
                position absolute; top: 50%; right 10px;
                width 40px; height 40px; margin-top -20px;
                background-image url("../../assets/images/yes_no.png")
                background-repeat no-repeat;
                background-size 40px 80px;
              }
            }
            input[type='text'],input[type='tel']{
              width 250px; height 60px;  padding  0 10px;
              border 4px solid #c58b01;/*px*/
              border-radius 8px;/*px*/
              font-size 24px;/*px*/ color #c58b01;
              background-color #fff2bb;
            }
            input[type='text']:disabled,input[type='tel']:disabled,input.send-code:disabled{
              opacity: 0.5;
            }
            input:disabled::-webkit-input-placeholder{
              opacity: 0.5;
            }
            input:disabled:focus::-webkit-input-placeholder{
              opacity: 0.5;
            }
            input::-webkit-input-placeholder{
              color:#c58b01;
            }
            input:focus::-webkit-input-placeholder{
              color:#c58b01;
            }
            .send-code{
              float left; width 144px; height 60px;margin-bottom 20px; margin-left 20px;
              border 2px solid rgba(255,255,255,0.5)
              font-size 24px;/*px*/ color #fff2bb;
              background-color: rgba( 208, 87, 40, 0.102 );
              border-radius 8px;/*px*/
            }
              textarea{
                width 414px;  padding 10px 20px;
                border 4px solid #c58b01;/*px*/
                border-radius 8px;/*px*/
                font-size 24px;/*px*/ color #c58b01; line-height 40px;/*px*/
                background-color #fff2bb;
              }
          }
          .select-box{
            padding-top 10px;
            span{
              position relative;
              float left;
              width 126px; height 50px; margin-right 20px; padding 6px 10px;
              border-radius 8px;/*px*/
              background-color #5b3920;
              &:after{
                content '';
                position absolute; top:-54px; left 0;
                width 126px; height 54px;
                background-image url("../../assets/images/apply_type.png")
                background-size 418px 54px;
                background-position 0 0;
              }
              &.miao:after{
                background-position 272px 0;
              }
              &.other:after{
                background-position 130px 0;
              }
              i{
                display block;
                font-size 28px;/*px*/ color #e4752d; text-align center; line-height 36px;
                font-style normal;
                border-radius 4px;/*px*/
              }
              &.active i{
                color #fff;
                border 2px dotted rgb( 236, 211, 173 );/*px*/
              }
            }
          }
        }
      }
      .apply-btn{
        width 240px; height 80px; margin 10px auto 40px;
        background-image url("../../assets/images/apply_btn.png")
        background-size 100% 100%;
      }
    }
    .file-box{
      width 85.8%; margin 0 auto; padding 40px 0;
      border-top 2px dashed rgb( 255, 102, 49 );/*px*/
      /*overflow hidden;*/
      .upload-list{
        position relative;
        float left; width 130px; height 130px; border 8px solid #ff6631;/*px*/
        border-radius 8px;/*px*/ margin-right 40px; margin-bottom 20px;
        &:nth-of-type(4n){
          margin-right 0;
        }
        .img-box{
          width 100%; height 100%; overflow hidden;
        }
        img{
          display block; width 100%; height auto;
        }
        .close-icon{
          position absolute;
          top:-20px;/*px*/  right -20px;/*px*/
          width 40px;/*px*/ height 40px;/*px*/ line-height 36px;/*px*/
          border 2px solid #fff;/*px*/ border-radius 50%;
          font-size 28px;/*px*/ text-align center; color #fff; font-style normal;
          background-color #ff6631;
        }
        .progress{
          position absolute; left 0; top:0;
          width 100%;
          -webkit-transform: translate(0,50%);
          -moz-transform:translate(0,50%);
          transform: translate(0,50%);
        }
      }
      .tip-box{
        width 100%; padding-top 10px;
        p{
          font-size 28px; color #ff6631; text-align center; line-height 40px;
          span{
            padding 0 40px;
            font-size 24px; color rgba(0,0,0,0.6);line-height 40px; text-align center
          }
        }
      }
    }
  }
</style>
