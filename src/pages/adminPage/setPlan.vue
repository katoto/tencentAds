<template>
    <div class="app-container">
        <div class="setPlanHead clear">
            <div style="float: left">
                <button style="padding: 10px 20px;margin-top: 4px" class="el-button el-button--default" type="button">
                    <i class="el-icon-arrow-left"></i>
                    <span>返回上一级</span>
                </button>
            </div>
            <section style="float: right">
                店铺名称：
                <el-select size="small" v-model="shopSelList" placeholder="活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
                当前UID：<span>111112312</span>
                <el-input size="small" style="margin-left: 20px" v-model="shopIputId" placeholder="搜索店铺ID">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-button size="small" style="margin-left: 10px" type="primary" @click="onSubmit">搜索</el-button>
            </section>
        </div>
        <section class="content" style="margin: 10px 0">
            <!-- 主体内容 -->
            <div>
                <div>
                    推广目标：<span>电商网页</span>
                    <span>* 日限额</span>
                    <el-input size="small" v-model="formInline.user" placeholder="日限额"></el-input>
                    元
                    <span>投放模式</span>
                    <el-switch
                        size="small"
                        v-model="value3"
                        active-text="加速投放"
                        inactive-text="标准投放">
                    </el-switch>
                </div>
                <div style="margin-top: 10px">
                    落地页：
                    <el-radio v-model="radio" label="1">备选项</el-radio>
                    <el-radio v-model="radio" label="2">备选项</el-radio>
                    <el-select style="margin-left: 10px" size="small" v-model="formInline.region" placeholder="活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                    <el-select style="margin-left: 10px" size="small" v-model="formInline.region" placeholder="活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import { mTypes, aTypes } from '~/store/modules/adminPage'
    export default {
        data(){
            return {
                radio: '',
                value3: '',
                shopIputId: '',
                shopSelList: '',
                formInline: {
                    user: '',
                    region: ''
                },

                openAttention: true,
                isMonitor: false, // 监控
                isAttention: false, // 关注
                shopStateVal: '',

                shop_remark: '',
                remarkBoxVisible: false,

                // new edn
                userMsgCounts: 10,
                userPageNumber: 1,
                userPageSize: 30,

                userMoreList: [],
                userMoreMsg: [],
                showAttentBox: false,

                searchUid: null,

                pageCounts: 10,
                pageNumber: 1,
                pageSize: 10,
                currPageNumber: null,

                js_withdrawMsg: null,
                currLineData: null,
                currType: null,

                currUserUid: null
            }
        },
        watch: {},
        methods: {
            async monitorFn(rowMsg){
//                监控
                this.showAttentBox = true
            },
            async attentionFn(rowMsg){
                // 关注
            },
            async addRemarkFn(rowMsg){
                // 添加备注
                this.remarkBoxVisible = true;
            },
            formatConsumeFn (row, column){
                let num = Number(row.totalConsume);
                if (isNaN(num)) {
                    return 0
                }
                if (num < 100) {
                    return num
                } else if (num < 10000) {
                    return Math.round(num / 1000 * 10) / 10 + '千'
                } else if (num < 100000000) {
                    return Math.round(num / 10000 * 10) / 10 + '万'
                } else {
                    return Math.round(num / 100000000 * 10) / 10 + '亿'
                }
            },
            // new end
            initShopList(){
                /* 初始化当前列表 */
                this.searchUid = null;
                this.pageNumber = 1;
                this.pageSize = 10;
                this.handleCurrentChange(1)
            },
            async surePay(){
                let surePayBack = null;
                Object.assign(this.currLineData, {
                    remark: this.shop_remark,
                    isAgree: this.currType
                })

                if (this.currType === '-1') {
                    surePayBack = await this.$store.dispatch(aTypes.setWithDrawReview, this.currLineData);
                } else {
                    surePayBack = await this.$store.dispatch(aTypes.setWithDrawReview, this.currLineData);
                }

                if (surePayBack) {
                    this.remarkBoxVisible = false;
                    if (this.currPageNumber) {
                        this.$store.dispatch(aTypes.getWithdrawOrder, {
                            'pageNumber': this.currPageNumber,
                            'pageSize': this.pageSize
                        });
                    } else {
                        this.$store.dispatch(aTypes.getWithdrawOrder)
                    }
                }
            },
            async jumpUidFn(data){
                let msgTop = await this.$store.dispatch(aTypes.getWithdrawProfit, data.uid);
                console.log(msgTop);
                this.currUserUid = data.uid;
                this.userMoreMsg = [];
                if (msgTop) {
                    this.userMoreMsg.push(msgTop)
                } else {
                    this.$message({
                        message: 'getWithdrawProfit error' + JSON.stringify(msgTop),
                        type: 'error',
                        duration: 1200
                    })
                }
                let msgBottom = await this.$store.dispatch(aTypes.getAccountDetail, {
                    uid: data.uid,
                    pageNumber: 1,
                    pageSize: this.userPageSize
                });
                if (msgBottom) {
                    this.userPageNumber = Number(msgBottom.currentPage);
                    this.userMsgCounts = Number(msgBottom.pages);
                    if (msgBottom.orders) {
                        msgBottom.orders.forEach((val, index) => {

                        })
                    }
                    this.userMoreList = msgBottom.orders
                }
                this.showAttentBox = true;

            },
            async searchShopIdFn(){
                if (!this.searchUid) {
                    return false;
                }
                let withDrawMsg = await this.$store.dispatch(aTypes.getWithdrawOrder, {
                    'pageNumber': 1,
                    'pageSize': this.pageSize,
                    'uid': this.searchUid
                });
                if (withDrawMsg) {
                    this.pageCounts = Number(withDrawMsg.pages);
                    this.pageNumber = Number(withDrawMsg.currentPage);
                }
            },

            confirmFn(lineData, type){
                if (type === '-1') {
                    this.js_withdrawMsg = '拒绝用户uid《 ' + lineData.uid + ' 》提款？'

                } else {
                    this.js_withdrawMsg = '允许用户uid《 ' + lineData.uid + ' 》提款？'
                }
                this.remarkBoxVisible = true;
                this.currLineData = lineData;
                this.currType = type;
            },
            format (time, format = 'yyyy-MM-dd') {
                time = +time * 1000;
                let t = new Date(time);
                let tf = function (i) {
                    return (i < 10 ? '0' : '') + i
                };
                return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
                    switch (a) {
                        case 'yyyy':
                            return tf(t.getFullYear());
                        case 'MM':
                            return tf(t.getMonth() + 1);
                        case 'mm':
                            return tf(t.getMinutes());
                        case 'dd':
                            return tf(t.getDate());
                        case 'HH':
                            return tf(t.getHours());
                        case 'ss':
                            return tf(t.getSeconds())
                    }
                })
            },
            lineClick(row, type){
                this.shop_remark = '';
                this.confirmFn(row, type)
            },

            async handleCurrentChange (val) {
                let withDrawMsg = null;
                this.currPageNumber = Number(val)
                if (this.searchUid !== '') {
                    withDrawMsg = await this.$store.dispatch(aTypes.getWithdrawOrder, {
                        'pageNumber': Number(val),
                        'pageSize': this.pageSize,
                        'uid': this.searchUid
                    })
                } else {
                    withDrawMsg = await this.$store.dispatch(aTypes.getWithdrawOrder, {
                        'pageNumber': Number(val),
                        'pageSize': this.pageSize
                    })

                }
                if (withDrawMsg) {
                    this.pageCounts = Number(withDrawMsg.pages);
                }
            },
            // 弹窗里头的分页
            async userCurrentChange (val) {
                let msgBottom = null;
                if (this.currUserUid !== '') {
                    msgBottom = await this.$store.dispatch(aTypes.getAccountDetail, {
                        'pageNumber': Number(val),
                        'pageSize': this.userPageSize,
                        'uid': this.currUserUid
                    })
                } else {
                    msgBottom = await this.$store.dispatch(aTypes.getAccountDetail, {
                        'pageNumber': Number(val),
                        'pageSize': this.userPageSize
                    })
                }

                if (msgBottom) {
                    this.userPageNumber = Number(msgBottom.currentPage);
                    this.userMsgCounts = Number(msgBottom.pages);
                    if (msgBottom.orders) {
                        msgBottom.orders.forEach((val, index) => {

                        })
                    }
                    this.userMoreList = msgBottom.orders
                }

                if (msgBottom) {
                    this.pageCounts = Number(msgBottom.pages);
                }
            },

        },
        computed: {
//            withdrawList(){
//                return this.$store.state.betblock.withdrawList
//            }
        },
        async mounted(){
            let withDrawMsg = await this.$store.dispatch(aTypes.getWithdrawOrder, {
                'pageNumber': 1,
                'pageSize': this.pageSize
            })
            if (withDrawMsg) {
                this.pageCounts = Number(withDrawMsg.pages);
                this.pageNumber = Number(withDrawMsg.currentPage);
            }

        },
        filters: {
            format (time, format = 'yyyy-MM-dd') {
                let t = new Date(time)
                let tf = function (i) {
                    return (i < 10 ? '0' : '') + i
                }
                return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
                    switch (a) {
                        case 'yyyy':
                            return tf(t.getFullYear())
                        case 'MM':
                            return tf(t.getMonth() + 1)
                        case 'mm':
                            return tf(t.getMinutes())
                        case 'dd':
                            return tf(t.getDate())
                        case 'HH':
                            return tf(t.getHours())
                        case 'ss':
                            return tf(t.getSeconds())
                    }
                })
            },
        }
    }
</script>
<style>
    .operateStyle .el-button:first-child {
        margin-left: 10px;
    }

    .el-button {
        margin-bottom: 1px;
    }

    .el-pagination {
        text-align: center;
        margin-top: 10px;
    }

    .el-input {
        width: 200px;
        line-height: 40px;
    }

    .clear:after {
        content: '';
        clear: both;
        display: block;
        height: 0;
        visibility: hidden
    }

    .el-input__inner {
        height: 42px;
        line-height: 42px !important;
    }

    .el-switch {
        margin: 10px 20px;
    }
</style>
