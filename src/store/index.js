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
    userList: null,
    userInfo: null,
}
const mutations = {
    setUserList (state, list) {
        state.userList = list
    },
    setUserInfo (state, info) {
        state.userInfo = info
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
    },
    /*  用户登录  */
    async login ({commit, dispatch}, data) {
        try {
            let InfoData = null
            data = data || {}
            InfoData = await ajax.post(`/users/login`, {
                username: data.name,
                password: data.pass
            });
            if(InfoData.code === 200) {
                commit('setUserInfo', InfoData.data)
            }
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
