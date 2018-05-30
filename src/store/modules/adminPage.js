/**
 * Created by xiezg on 2018/4/9.
 */

import ajax from '~common/ajax'
import { src, mapMutations, mapActions, getCK, setCK, removeCK, access_token, account_id } from '~common/util'
import { Message } from 'element-ui'

const state = {
    withdrawList: null
}

const mutationsInfo = mapMutations({
    setWithDrawList (state, data) {
        state.withdrawList = data
    },
    setNationGetRed (state, data) {
        state.nationGetRed = data
    }

}, 'adminModule')

const actionsInfo = mapActions({
    /* ads adminCenter 列表接口 */
    async getAdsUserList ({commit, dispatch}, pageData) {
        try {
            let InfoData = null
            if (pageData) {
                InfoData = await ajax.get(`/users/ads_user_list?pageno=${pageData.pageNumber}&rangeno=
                ${pageData.pageSize}&src=${src}&token=${access_token}&account_id=${account_id}`)
            } else {
                InfoData = await ajax.get(`/users/ads_user_list`)
            }
            return InfoData
        } catch (e) {
            Message({
                message: e.message,
                type: 'error',
                duration: 5 * 1000
            })
        }
    },

    /* 获取定向设置 列表数据 */
    async getEditDXMsg ({commit, dispatch}, data) {
        try {
            let InfoData = null
            if (data) {
                InfoData = await ajax.get(`http://10.0.1.167:6999/goods/result/review?ck=${getCK()}&expectId=${data.expectId}&result=${data.isAgree}`)
            } else {
                InfoData = await ajax.get(`/tx/targeting?token=${access_token}&account_id=${account_id}`)
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
    },

    /* 获取 资源位数据 */
    async getEditRes ({commit, dispatch}, data) {
        try {
            let InfoData = null
            if (data) {
                InfoData = await ajax.get(`http://10.0.1.167:6999/goods/result/review?ck=${getCK()}&expectId=${data.expectId}&result=${data.isAgree}`)
            } else {
                InfoData = await ajax.get(`/tx/creative_tpl`)
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
    },

    /* 获取 过滤的图片 */
    async getFilterImg ({commit, dispatch}, data) {
        try {
            let InfoData = null
            InfoData = await ajax.get(`/tx/images?token=${access_token}&account_id=${account_id}&filtering=[{"field":"image_width","operator":"EQUALS","values":[${Number(data)}]}]`)
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

    /*  上传 设置数据  */
    async updatePlanMsg ({commit, dispatch}, data) {
        try {
            let InfoData = null
            if (data) {
                InfoData = await ajax.get(`http://10.0.1.167:6999/goods/operate?ck=${getCK()}&expectId=${data.expectId}&state=${data.operateState}`)
            } else {
                InfoData = await ajax.get(`http://10.0.1.167:6999/goods/operate`)
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

}, 'adminModule')

export const mTypes = mutationsInfo.mTypes
const mutations = mutationsInfo.mutations
export const aTypes = actionsInfo.aTypes
const actions = actionsInfo.actions
export default {state, mutations, actions}
