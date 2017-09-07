<template>
  <div class="home">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'home',
    data () {
      return {
        msg: '首页'
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
