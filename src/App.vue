<script>
  import { actions } from './store';
  import Card from './components/card';
  import List from './components/list';
  import TextContent from './components/text';
  import Message from './components/message';

export default {
  name: 'App',
  components: { Card, List, TextContent, Message },
  vuex: {
    actions: actions
  },
  created () {

    this.$store.dispatch('initData');
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