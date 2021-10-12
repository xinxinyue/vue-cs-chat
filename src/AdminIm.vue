<script>
  import { actions } from './store';
  import Card from './components/card';
  import List from './components/list';
  import TextContent from './components/text';
  import Message from './components/message';
  import axios from 'axios';

export default {
  name: 'AdminIm',
  components: { Card, List, TextContent, Message },
  vuex: {
    actions: actions
  },
  created () {
    alert('管理员登录');
    let id = prompt('输入管理员id');
    var that = this
    axios.get('http://192.168.220.128:9501/admin-login', {
      params: {
        id: id,
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
          that.$store.dispatch('sendMessage', {
            content : "客服您好",
          });
          // alert('Connect To Service');
        };

        //监听消息
        webSocket.onmessage = function(event) {
          console.log("onMessage");

          var data = eval('(' + event.data + ')');
          that.$store.dispatch('receivedMessage',{
            content : data.body,
            userId : data.source_id
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
    <div class="sidebar">
      <Card></Card>
      <List></List>
    </div>
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