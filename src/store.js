/**
 * Vuex
 * http://vuex.vuejs.org/zh-cn/intro.html
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const now = new Date();
const store = new Vuex.Store({
    state: {
        // 当前用户
        user: {
            name: 'coffce',
            img: require('./assets/images/1.jpg')
        },
        // 会话列表
        sessions: [
            {
                id: 0,
                user: {
                    name: '自动客服',
                    img: require('./assets/images/2.png')
                },
                messages: []
            },
            {
                id: 1,
                user: {
                    name: '示例介绍',
                    img: require('./assets/images/3.jpg')
                },
                messages: [
                    {
                        content: 'Hello，这是一个基于Vue + Vuex + Webpack构建的简单chat示例，聊天记录保存在localStorge, 有什么问题可以通过Github Issue问我。',
                        date: now
                    }, {
                        content: '项目地址: https://github.com/coffcer/vue-chat',
                        date: now
                    }
                ]
            },
            {
                id: 2,
                user: {
                    name: 'webpack',
                    img: require('./assets/images/3.jpg')
                },
                messages: []
            }
        ],
        // 当前选中的会话
        currentSessionId: 1,
        // 过滤出只包含这个key的会话
        filterKey: ''
    },
    mutations: {
        INIT_DATA (state) {
            let data = localStorage.getItem('vue-chat-session');
            if (data) {
                state.sessions = JSON.parse(data);
            }
        },
        // 发送消息
        // SEND_MESSAGE ({ sessions, currentSessionId }, content ,webSocket) {
        SEND_MESSAGE ({ sessions, currentSessionId }, content) {
            let session = sessions.find(item => item.id === currentSessionId);
            // webSocket.send(`{"method":"serverBroadcast","body":"${content}"}`);
            session.messages.push({
                content: content,
                date: new Date(),
                self: true
            });
        },
        // 接收消息
        RECEIVED_MESSAGE ({ sessions }, content, userId ) {
            let session = sessions.find(item => item.id === userId);
            session.messages.push({
                content: content,
                date: new Date(),
                self: false
            });
        },
        // 选择会话
        SELECT_SESSION (state, id) {
            state.currentSessionId = id;
        } ,
        // 搜索
        SET_FILTER_KEY (state, value) {
            state.filterKey = value;
        }
    },
    actions : {
        initData(context) {
            context.commit('INIT_DATA');
        },
        sendMessage(context,content) {
            context.commit('SEND_MESSAGE',content);
        } ,
        receivedMessage(context,content, userId, webSocket) {
            context.commit('RECEIVED_MESSAGE',content, userId, webSocket);
        },
        selectSession(context,id) {
            context.commit('SELECT_SESSION',id);
        },
        search(context,value) {
            context.commit('SET_FILTER_KEY',value);
        }
    }
});

store.watch(
    (state) => state.sessions,
    (val) => {
        console.log('CHANGE: ', val);
        localStorage.setItem('vue-chat-session', JSON.stringify(val));
    },
    {
        deep: true
    }
);

export default store;
export const actions = {
    initData: ({ dispatch }) => dispatch('INIT_DATA'),
    // sendMessage: ({ dispatch }, content, webSocket) => dispatch('SEND_MESSAGE', content, webSocket),
    sendMessage: ({ dispatch }, content) => dispatch('SEND_MESSAGE', content),
    receivedMessage: ({ dispatch }, content, userId, webSocket) => dispatch('RECEIVED_MESSAGE', content, userId,webSocket),
    selectSession: ({ dispatch }, id) => dispatch('SELECT_SESSION', id),
    search: ({ dispatch }, value) => dispatch('SET_FILTER_KEY', value)
};
