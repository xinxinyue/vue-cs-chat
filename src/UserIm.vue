<script>
  import { actions } from './store';
  import TextContent from './components/text';
  import Message from './components/message';
  import axios from 'axios';

export default {
  name: 'UserIm',
  components: {TextContent, Message },
  vuex: {
    actions: actions
  },
  created () {
    alert('普通用户登录');
    let username = prompt('输入username')
    let password = prompt('输入password')
    var that = this
    axios.get('http://192.168.220.128:9501/login', {
      params: {
        username: username,
        password: password
      }
    }).then(function (response) {
      if(response.data.code == 1000){
        var webSocket = new WebSocket('ws://192.168.220.128:9502', response.data.data);
        that.$store.state.webSocket = webSocket;
        that.$store.state.token = response.data.data;
        webSocket.onerror = function(event) {
          console.log(event)
          console.log("error:" + event.data);
        };

        // 打开websocket
        webSocket.onopen = function() {
          that.$store.dispatch('initData');
          console.log('Connect To Service');
        };

        //监听消息
        webSocket.onmessage = function(event) {
          console.log("onMessage");

          var data = eval('(' + event.data + ')');
          that.$store.dispatch('receivedMessage',{
            content : data.body,
            userId : 0
          });
        };

        //关闭连接
        webSocket.onclose = function() {
          alert('close');
          webSocket.close();
        }
      }else{
        alert(response.data.msg);
      }
    }).catch(function (error) {
      alert(error);
    });
  }
}
</script>

<template>
  <div id="app">
    <div class="main">
      <Message></Message>
      <TextContent></TextContent>
    </div>
  </div>

</template>

<style lang="less" scoped>
  #app {
    margin: 20px auto;
    width: 800px;
    height: 600px;
    overflow: hidden;
    border-radius: 3px;
    .sidebar, .main {
      height: 100%;
    }
    .sidebar {
      float: left;
      width: 200px;
      color: #f4f4f4;
      background-color: #2e3238;
    }
    .main {
      position: relative;
      overflow: hidden;
      background-color: #eee;
    }
    .text {
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
    }
    .message {
      height: ~'calc(100% - 160px)';
    }
  }
  </style>