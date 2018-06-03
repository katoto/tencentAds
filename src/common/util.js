/**
 * Created by sampson on 2017/5/15.
 */

import Cookies from 'js-cookie'

export const access_token = 'caa01391a04f4e983550bc1e51c0d1fc'
export const account_id = '7588414'
export const refresh_token = '8147c7566e2347c8d24b8b5693ee048f'

export const src = 'pc'

export function mapActions (acts, ns) {
    const aTypes = {}
    const actions = {}
    Object.keys(acts).forEach((key) => {
        aTypes[key] = [ns, key].join('/')
        actions[aTypes[key]] = acts[key]
    })
    return {actions, aTypes}
}

export const platform = (function () {
    return ~navigator.userAgent.indexOf('iPhone') ? 'ios' : 'android'
})()

export function mapMutations (muts, ns) {
    const mTypes = {}
    const mutations = {}
    Object.keys(muts).forEach((key) => {
        mTypes[key] = [ns, key].join('/')
        // console.log(key);
        // console.log(mTypes[key])
        mutations[mTypes[key]] = muts[key]
    })
    return {mutations, mTypes}
}

export function wait (time) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time)
    })
}

const CK = 'ads_token'

export function getToken () {
    return Cookies.get(CK)
}

export function setToken (ck) {
    return Cookies.set(CK, ck)
}

export function removeToken () {
    return Cookies.remove(CK)
}
