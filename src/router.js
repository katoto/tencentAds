/**
 * Created
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

/* Layout */
import Layout from '~/pages/layout/Layout'

const Login = () => import
('~pages/Login' /* webpackChunkName: "chunks/Login" */)
// 404  ok
const page_404 = () =>
    import
    ('~/pages/404.vue' /* webpackChunkName: "chunks/page404" */)

const DashBoard_index = () =>
    import
    ('~/pages/dashboard/index' /* webpackChunkName: "chunks/dashboard/index" */)

// betblock 相关的东西
const bb_withdraw = () => import('~/pages/betblock/withdraw')

// admin page
const t_adminCenter = () => import('~/pages/adminPage/adminCenter' /* webpackChunkName: "chunks/adminPage/adminCenter" */)
const t_setPlan = () => import('~/pages/adminPage/setPlan' /* webpackChunkName: "chunks/adminPage/setPlan" */)

Vue.use(VueRouter)
export default new VueRouter({
    mode: 'hash',
    routes: [
        {
            path: '/',
            component: Layout,
            redirect: '/login',
            name: 'home',
            hidden: true,
            children: [{
                path: 'home',
                component: DashBoard_index
            }]
        },
        {
            path: '/adminPage',
            component: Layout,
            redirect: '/adminPage/adminCenter',
            name: 'adminPage',
            meta: {title: '飞马营销平台', icon: 'example'},
            children: [
                {
                    path: 'adminCenter',
                    name: 'adminCenter',
                    component: t_adminCenter,
                    meta: {title: '店铺管理', icon: 'form'}
                },
                {
                    path: 'setPlan/:planId?',
                    name: 'more',
                    component: t_setPlan,
                    meta: {title: '新建计划', icon: 'tree'}
                }
            ]
        },
        {
            path: '/login',
            component: Login,
            hidden: true
        },
        {
            path: '/404',
            component: page_404,
            hidden: true
        },
        {
            path: '*',
            redirect: '/login'
        }
    ]
})
