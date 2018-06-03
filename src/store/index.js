/**
 * Created by lichun on 2017/1/19.
 */
import Vue from 'vue'
import Vuex from 'vuex'

import app from '~store/modules/app'
import adminPage from '~store/modules/adminPage'
import getters from './getters'

import ajax from '~common/ajax'
import { Message } from 'element-ui'

import { wait, refresh_token } from '../common/util'

Vue.use(Vuex)

const state = {
    version: '0.0.1',
    toast: {
        msg: '',
        visible: false
    },
    websocket: { // 数据推送相关的
        ondata: null,
        connect: null, // 代表当前连接
        data: null, // websocket 返回来的数据， 用到推送过来的数据的地方 watch一下就好了
        reconnect: 0 // socket 记录重连次数， 起到辅助作用， 比如websocket断开了连接， 重新请求接口， 避免推送丢失引发的问题
    },
    showErrorBox: false

}
const mutations = {
    initSocket (state, {connect}) {
        state.websocket.connect = connect
    },
    addConnectNum (state) {
        state.websocket.reconnect++
    },
    updateSocketData (state, data) {
        // console.log(JSON.stringify(data))
        // console.log('------------')
        if (data && data.method === 'syncGameStatus') {
            state.newGameGLState = data
        }
        state.websocket.data = data
    },
    showToast (state, msg) {
        state.toast.msg = msg
        state.toast.visible = true
    },
    hideToast (state) {
        state.toast.msg = ''
        state.toast.visible = false
    },
    showErrorBox (state, data) {
        state.showErrorBox = data
    }
}
const actions = {
    async getFreshToken ({dispatch, commit}) {
        try {
            let InfoData = null
            InfoData = await ajax.get(`/users/refresh?refresh_token=${refresh_token}`)
            return InfoData
        } catch (e) {
            Message({
                message: e.message,
                type: 'error',
                duration: 3000
            })
            return 0
        }
    }

}

export default () => new Vuex.Store({
    state,
    actions,
    mutations,
    modules: {
        app, adminPage
    },
    getters
})
