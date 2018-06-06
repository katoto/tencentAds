/**
 * Created by xiezg on 2018/4/9.
 */

import ajax from '~common/ajax'
import { src, mapMutations, mapActions, getCK, setCK, removeCK, getToken, account_id } from '~common/util'
import { Message } from 'element-ui'

const state = {
    currShopList: null
}

const mutationsInfo = mapMutations({
    setNationGetRed (state, data) {
        state.nationGetRed = data
    },
    setCurrShopList (state, data) {
        state.currShopList = data
    }

}, 'adminModule')

const actionsInfo = mapActions({
    /* ads adminCenter 列表接口 */
    async getAdsUserList ({ state , commit, dispatch}, pageData) {
        try {
            let InfoData = null
            if (pageData) {
                InfoData = await ajax.get(`/users/ads_user_list?agencyId=${pageData.agencyId}&pageno=${pageData.pageNumber}&rangeno=${pageData.pageSize}&src=${src}`)
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
    async getEditDXMsg ({state, commit, dispatch}, data) {
        try {
            let InfoData = null
            if (state && state.currShopList) {
                InfoData = await ajax.get(`/tx/targeting?token=${state.currShopList.token}&account_id=${state.currShopList.account_id}`)
            } else {
                Message({
                    message: 'getEditDXMsg 取token error',
                    type: 'error',
                    duration: 3000
                })
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
                InfoData = await ajax.get(`/tx/cy_tpl`)
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
            if (state && state.currShopList) {
                InfoData = await ajax.get(`/tx/images?token=${state.currShopList.token}&account_id=${state.currShopList.account_id}&filtering=[{"field":"image_width","operator":"EQUALS","values":[${Number(data)}]}]`)
            } else {
                Message({
                    message: 'getFilterImg 取token error',
                    type: 'error',
                    duration: 3000
                })
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

    /*  上传 设置数据  */
    async updatePlanMsg ({commit, dispatch}, data) {
        try {
            let InfoData = null
            data = data || {}

            if (state && state.currShopList) {
                Object.assign(data, {
                    token: state.currShopList.token,
                    account_id: state.currShopList.account_id
                })
            } else {
                Message({
                    message: 'getFilterImg 取token error',
                    type: 'error',
                    duration: 3000
                })
            }

            InfoData = await ajax.post(`/tx/create_ad`, data)
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
