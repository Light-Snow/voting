<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
    <router-link to="upload">上传文件</router-link>
    <div class="video-box">
      <video ref="video"   @loadeddata="captureImage()" :src="src" controls :poster="poster">
        <source :src="src" type="video/mp4">
      </video>
      <!--<video ref="video"  @loadeddata="captureImage()" :src="src" controls>-->
        <!--<source :src="src2" type="video/mp4">-->
      <!--</video>-->
      <!--<img class="poster" v-show="!playing" :src="poster" alt="">-->
    </div>


    <button @click="play">播放</button>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'hello',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        src: '/static/video/20170801113210.mp4',
        src2: '/static/video/20170801113210.mp4',
        poster: '/static/video/22335437.jpg',
        playing: false
      }
    },
    mounted() {
      this.default()
    },
    computed: {
    },
    methods: {
      default() {
        let mydata = {
          IP: '127.0.0.1',
          URL: 'http://localhost:8080/BPAnalisysServer/MtBPAPI',
          // HappenDateTime: '2017-04-21 09:56:29',
          ClientFlg: '1',
          BrowserType: 'firefox',
          EventType: 'Click',
          eventNumber: '1',
          eventAreaFlg: '地铁区',
          elementID: '2017042001',
          eventTitle: '地铁房'
        }
        axios.defaults.headers.post['content-Type'] = 'appliction/x-www-form-urlencoded'
        axios.post('/BPAnalisysServer/MtBPAPI', {
          'key': 'keyClickNumber',
          'content': JSON.stringify(mydata)
        }).then((res) => {
          console.log(res)
        })
      },
      captureImage() {
//        alert('11111')
        let video = this.$refs.video
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth * 1
        canvas.height = video.videoHeight * 1
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
        this.poster = canvas.toDataURL('image/png')
//        alert(this.poster)
//        console.log(this.poster)
      },
      play() {
        this.$refs.video.play()
        this.playing = true
      }
    },
    components: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .video-box{
    position: relative;
    width: 400px;
  }
  .video-box video{
    width: 200px; height: 380px;
  }
  .poster{
    position: absolute; left: 0; top: 0; width: 100%; z-index: 100; height: 100%;
  }
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
</style>
