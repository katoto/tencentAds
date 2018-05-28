<template>
    <div class="app-container">
        <div class="setPlanHead clear">
            <div style="float: left">
                <button @click="jump2adminCenter" style="padding: 10px 20px;margin-top: 4px"
                        class="el-button el-button--default" type="button">
                    <i class="el-icon-arrow-left"></i>
                    <span>返回上一级</span>
                </button>
            </div>
            <section style="float: right;">
                店铺名称：
                <el-select size="small" v-model="shopSelList" placeholder="活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
                当前UID：<span style="color: #606266">111112312</span>
                <el-input size="small" style="margin-left: 20px" v-model="shopIputId" placeholder="搜索店铺ID">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <!--@click="onSubmit"-->
                <el-button size="small" style="margin-left: 10px" type="primary">搜索</el-button>
            </section>
        </div>
        <section class="content" style="margin: 10px 0;border:1px solid #e2e2e2;padding: 10px">
            <!-- 主体内容 -->
            <div>
                <div>
                    推广目标： <span style="color: #606266">电商网页 </span>
                    <span style="margin-left: 36px"><b style="color: red">*</b> 日限额 </span>
                    <el-input style="width: 130px" size="small" v-model="formInline.user" placeholder="日限额"></el-input>
                    元
                    <span style="margin-left: 30px">投放模式：</span>
                    <el-switch style="color: #606266"
                               size="small"
                               v-model="value3"
                               active-text="加速投放"
                               inactive-text="标准投放">
                    </el-switch>
                </div>
                <div style="margin-top: 10px">
                    落地页：
                    <el-radio v-model="radio" label="1">单品页</el-radio>
                    <el-radio v-model="radio" label="2">聚合页</el-radio>
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
            <section>
                <div class="contentBodyTop">
                    <el-row :gutter="20">
                        <el-col :span="15">
                            <div class="grid-content bg-contentTop">
                                复制最新计划
                            </div>
                        </el-col>
                        <el-col :span="9">
                            <div class="grid-content bg-contentTop">
                                批量复制
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="contentBodyBottom">
                    <el-table
                        border
                        :data="planListData"
                        stripe
                        highlight-current-row
                        style="width: 100%">
                        <el-table-column
                            prop="planIndex"
                            label="计划序号"
                            width="90">
                        </el-table-column>
                        <el-table-column
                            prop="planPackage"
                            label="定向">
                        </el-table-column>
                        <el-table-column
                            prop="res_name"
                            label="资源位">
                        </el-table-column>
                        <el-table-column
                            label="创意">
                            <template slot-scope="scope">
                                <img class="reg_imgStyle" :src="scope.row.res_img" alt="">
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="排期与出价"
                        >
                            <template slot-scope="scope">
                                <p>2018/05/21 - 2018/05/22</p>
                                <p>全天CPC 1.4元</p>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="110"
                        >
                            <template slot-scope="scope">
                                <el-button @click="monitorFn( scope.row )" icon="el-icon-delete"
                                           type="danger" size="small">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div v-if="planListData.length === 0">
                        <el-button class="addPlan" @click="setPlanAds" type="success" icon="el-icon-edit">设置计划
                        </el-button>
                    </div>
                </div>
            </section>
        </section>
        <el-dialog class="planEdit" :fullscreen=true  width="85%" title="计划设置" :visible.sync="showAttentBox" center>
            <section>
                <h4 style="margin-bottom: 20px">定向设置</h4>
                <div v-if="true" class="planEditDX" style="position: relative;">
                    <el-row :gutter="20">
                        <el-col :span="13">
                            <div class="grid-content bg-purple">
                                <p style="padding-bottom: 10px;font-weight: bold">所选定向：<span>总群包TX</span></p>
                                <section class="planEditDXContent"
                                         style="width: 100%;height: 300px;overflow-y: scroll;border-top: 1px solid #ebfafa">
                                    <p style="margin-top: 10px" v-for="item in setPlanDX">{{ item }}</p>
                                </section>
                            </div>
                        </el-col>
                        <el-col :span="7">
                            <div class="grid-content bg-purple">
                                <el-select style="width: 300px" v-model="SearchDXval" clearable filterable
                                           placeholder="搜索定向名称">
                                    <el-option
                                        v-for="item in SearchDXoptions"
                                        :key="item.targeting_id"
                                        :label="item.targeting_name"
                                        :value="item.targeting_id">
                                    </el-option>
                                </el-select>
                                <ul class="searchDXUL" style="display: none">
                                    <li v-for="item in SearchDXoptions" :data-targetId="item.targeting_id ">
                                        {{ item.targeting_name }}
                                    </li>
                                </ul>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <section v-else>
                    <p style="color: #9b9b9b;text-align: center;line-height: 30px;">0410筛选地区-商务政法微信</p>
                    <el-button size="small" type="success" icon="el-icon-edit">重新编辑</el-button>
                </section>
            </section>
            <section class="setPlanZY">
                <h4>资源位设置</h4>
                <div v-if="true" class="editRes">
                    <el-table
                        :data="shopListData"
                        height="350"
                        stripe
                        @cell-click="listResClick"
                        highlight-current-row
                        style="width: 100%">
                        <el-table-column
                            prop="adcreative_template_sites[0].adcreative_template_name"
                            label="广告版位">
                        </el-table-column>
                        <el-table-column
                            prop="adcreative_template_sites[0].adcreative_template_style"
                            label="创意形式">
                        </el-table-column>
                        <el-table-column
                            prop="adcreative_template_sites[0].adcreative_template_desc"
                            label="描述">
                        </el-table-column>
                        <!--<el-table-column-->
                            <!--prop="adcreative_template_sites[0].adcreative_template_size"-->
                            <!--label="曝光量">-->
                        <!--</el-table-column>-->
                    </el-table>
                </div>
                <section v-else>
                    <p style="color: #9b9b9b;text-align: center;line-height: 30px;">QQ_582×166单图(文)</p>
                    <el-button size="small" type="success" icon="el-icon-edit">重新编辑</el-button>
                </section>
            </section>
            <section style="margin-top: 10px;border-top: 2px solid #ccc;padding-top: 10px">
                <h4>创意设置</h4>
                <div class="setPlanCY">
                    <ul class="clear" v-if="filterData.length > 0">
                        <li v-for="img in filterData">
                            <img :src="img.preview_url"
                                 alt="">
                        </li>
                    </ul>
                    <p v-else style="text-align: center;margin: 20px ">
                        暂无数据~
                    </p>
                </div>
            </section>
            <section style="margin-top: 10px;border-top: 2px solid #ccc;padding-top: 10px">
                <h4>排期与出价设置</h4>
                <div>
                    <div class="planEditBottom">
                        投放日期：
                        <el-radio v-model="radio" label="1">长期投放</el-radio>
                        <el-radio v-model="radio" label="2">在日期范围内投放</el-radio>
                    </div>
                    <div class="planEditBottom">
                        投放时间：
                        <el-radio v-model="radio" label="1">全天</el-radio>
                        <el-radio v-model="radio" label="2">特定时间段</el-radio>
                    </div>
                    <div class="planEditBottom">
                        出价方式：
                        <el-radio v-model="radio" label="1">CPC</el-radio>
                        <el-radio v-model="radio" label="2">CPM</el-radio>
                        <el-radio v-model="radio" label="2">oCPA</el-radio>
                    </div>
                    <span style="margin-left: 36px"><b style="color: red">*</b> 出价 </span>
                    <el-input style="width: 130px" size="small" v-model="formInline.user" placeholder="日限额"></el-input>
                    元 <span style="margin-left: 20px;color: #adb6c0">建议出价<b style="color: #1f2d3d">0.58 ~ 0.81</b> 元/点击</span>
                </div>
            </section>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="surePay">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { mTypes, aTypes } from '~/store/modules/adminPage'
    export default {
        data () {
            return {

                filterData:[],

                shopListData: [{
                    adcreative_template_name: '天天快报',
                    adcreative_template_style: '230*152单图2',
                    adcreative_template_desc: '新闻信息流，微信',
                    adcreative_template_size: '1000'
                }],
                setPlanDX: ['性别：男', '年龄：大于等于41岁', '付费用户：电商交易用户', '商业兴趣：生活用品',
                    '联网方式：Wifi、4G',
                    '地理位置：（常住）中国未知（常住）中国未知、北京市、河北省、北京市、河北省（常住）中国未知、北京市、河北省（常住）中国未知、北京市、河北省'],
                showAttentBox: false,

                SearchDXoptions: [{
                    'targeting_id': '33212772',
                    'targeting_name': 'QQ-582×498单图(文)-2018042032965',
                    'description': '',
                    'targeting': {},
                    'created_time': 1524231147,
                    'last_modified_time': 1524231147,
                    'ad_lock_status': 'ADLOCKSTATUS_UNLOCKED'
                }],
                SearchDXval: '33212772',

                radio: '',
                value3: '',
                shopIputId: '',
                shopSelList: '',
                formInline: {
                    user: '',
                    region: ''
                },
                //	            planListData: [{ //  数据模拟
                //	                planIndex: '1',
                //	                planPackage: '总群包WX',
                //	                res_name: '腾讯新闻——230* 153',
                //	                res_img: 'http://img2.kwcdn.kuwo.cn/star/upload/11/11/1452480444427_.jpg',
                //	                conversionCost: 1,
                //	                shopOperate: '关注中',
                //	                shopRemark: ''
                //	            }, { //  数据模拟
                //	                planIndex: '1',
                //	                planPackage: '总群包WX',
                //	                res_name: '腾讯新闻——230* 153',
                //	                res_img: 'http://img2.kwcdn.kuwo.cn/star/upload/11/11/1452480444427_.jpg',
                //	                conversionCost: 1,
                //	                shopOperate: '关注中',
                //	                shopRemark: ''
                //	            }, { //  数据模拟
                //	                planIndex: '2',
                //	                planPackage: '总群包WX',
                //	                res_name: '腾讯新闻——230* 153',
                //	                res_img: 'http://img2.kwcdn.kuwo.cn/star/upload/11/11/1452480444427_.jpg',
                //	                conversionCost: 1,
                //	                shopOperate: '关注中',
                //	                shopRemark: ''
                //	            }
                //	            ],
                planListData: [],
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
            async listResClick( row ){
                if( row.adcreative_template_sites[0] ){
                    if( row.adcreative_template_sites[0].adcreative_template_size.indexOf('×')> -1 ){
                        let currImgSize = row.adcreative_template_sites[0].adcreative_template_size.split('×')[0];
                        console.log(currImgSize)
                        let filterImgData = await this.$store.dispatch(aTypes.getFilterImg , currImgSize)
                        console.log(filterImgData)
                        console.log('===filterImgData=====')
                        if (filterImgData.code === 0) {
                            this.filterData = filterImgData.data.list
                        } else {
                            this.$message({
                                message: filterImgData.message,
                                type: 'error',
                                duration: 1200
                            })
                        }
                    }else{
                      // 无数据
                        this.filterData = []
                    }
                }
            },
            async setPlanAds () {
                this.showAttentBox = true
                let editDXMsg = await this.$store.dispatch(aTypes.getEditDXMsg)
                console.log(editDXMsg)
                console.log('-------editDXMsg')
                if (editDXMsg.code !== 11000) {
                    this.SearchDXoptions = editDXMsg.data.list
                } else {
                    this.$message({
                        message: editDXMsg.message,
                        type: 'error',
                        duration: 1200
                    })
                }
                let editRes = await this.$store.dispatch(aTypes.getEditRes)
                console.log(editRes)
                console.log('=====editRes')
                if (editRes.code === 0) {
                    this.shopListData = editRes.data.list
                } else {
                    this.$message({
                        message: editRes.message,
                        type: 'error',
                        duration: 1200
                    })
                }
            },

            jump2adminCenter () {

            },
            async monitorFn (rowMsg) {
                //                监控
                this.showAttentBox = true
            },
            async attentionFn (rowMsg) {
                // 关注
            },
            async addRemarkFn (rowMsg) {
                // 添加备注
                this.remarkBoxVisible = true
            },
            formatConsumeFn (row, column) {
                let num = Number(row.planPackage)
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
            initShopList () {
                /* 初始化当前列表 */
                this.searchUid = null
                this.pageNumber = 1
                this.pageSize = 10
            },
            async surePay () {
                let surePayBack = null
                Object.assign(this.currLineData, {
                    remark: this.shop_remark,
                    isAgree: this.currType
                })

                if (this.currType === '-1') {
                    surePayBack = await this.$store.dispatch(aTypes.setWithDrawReview, this.currLineData)
                } else {
                    surePayBack = await this.$store.dispatch(aTypes.setWithDrawReview, this.currLineData)
                }

                if (surePayBack) {
                    this.remarkBoxVisible = false
                    if (this.currPageNumber) {
                        this.$store.dispatch(aTypes.getWithdrawOrder, {
                            'pageNumber': this.currPageNumber,
                            'pageSize': this.pageSize
                        })
                    } else {
                        this.$store.dispatch(aTypes.getWithdrawOrder)
                    }
                }
            },

            async searchShopIdFn () {
                if (!this.searchUid) {
                    return false
                }
                let withDrawMsg = await this.$store.dispatch(aTypes.getWithdrawOrder, {
                    'pageNumber': 1,
                    'pageSize': this.pageSize,
                    'uid': this.searchUid
                })
                if (withDrawMsg) {
                    this.pageCounts = Number(withDrawMsg.pages)
                    this.pageNumber = Number(withDrawMsg.currentPage)
                }
            },

            confirmFn (lineData, type) {
                if (type === '-1') {
                    this.js_withdrawMsg = '拒绝用户uid《 ' + lineData.uid + ' 》提款？'
                } else {
                    this.js_withdrawMsg = '允许用户uid《 ' + lineData.uid + ' 》提款？'
                }
                this.remarkBoxVisible = true
                this.currLineData = lineData
                this.currType = type
            },

            lineClick (row, type) {
                this.shop_remark = ''
                this.confirmFn(row, type)
            }

        },
        computed: {
            //            withdrawList(){
            //                return this.$store.state.betblock.withdrawList
            //            }
        },
        async mounted () {

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
            }
        }
    }
</script>
<style scoped>

    .editRes{
    }


    .setPlanCY {
        margin-top: 10px;
    }

    .setPlanCY ul {
        padding: 30px 10px;
        border: 1px solid #d5d5d5;
        height: 300px;
        overflow-y: scroll;
    }

    .setPlanCY ul li {
        width: 130px;
        height: 130px;
        border: 1px solid #000;
        float: left;
        margin-left: 20px;
        margin-top: 10px;
    }

    .setPlanCY ul li img {
        width: 100%;
        height: 100%;
        display: block;
    }

    .setPlanZY {
        margin-top: 10px;
        border-top: 2px solid #ccc;
        padding-top: 10px;
    }

    .setPlanZY .cell {
        font-size: 12px !important
    }

    .searchDXUL {
        /*width: 217px;*/
        border: 1px solid #b4b4b4;
        padding-left: 5px;
        border-radius: 2px;
        height: 270px;
        overflow-y: scroll;
    }

    .searchDXUL li {
        width: 100%;
        height: 35px;
        line-height: 35px;
        border-bottom: 1px solid #b6b6b6;
    }

    .searchDXUL li:hover {
        background-color: #e8eef3;
    }

    .planEditDX .el-col {
        margin-left: 10px !important
    }

    .planEdit section .el-button {
        display: block;
        margin: 0 auto;
    }

    .planEdit .planEditBottom {
        margin: 20px 40px;
        font-size: 16px;
    }

    .addPlan {
        margin: 10px auto !important;
        display: block;
    }

    .reg_imgStyle {
        width: 100px;
        height: 80px;
        display: block;
    }

    .contentBodyBottom {
        margin-top: 10px;
    }

    .contentBodyBottom .el-table, .contentBodyBottom .el-table th {
        text-align: center;
    }

    .contentBodyTop .el-col {
        margin-top: 30px;
        height: 40px;
    }

    .contentBodyTop .bg-contentTop {
        background-color: #409EFF;
        height: 100%;
        width: 100%;
        border-radius: 8px;
        line-height: 40px;
        font-size: 16px;
        text-align: center;
        color: #f3f3f3;
        cursor: pointer;
    }

    .contentBodyTop .bg-contentTop:active {
        background-color: #3684d8;
    }

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
