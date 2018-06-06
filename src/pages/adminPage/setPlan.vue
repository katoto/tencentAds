<template>
    <div class="app-container">
        <div class="setPlanHead clear">
            <div style="float: left" v-if="this.$route.params.planId != ':planId'">
                <button @click="jump2adminCenter" style="padding: 10px 20px;margin-top: 4px"
                        class="el-button el-button--default" type="button">
                    <i class="el-icon-arrow-left"></i>
                    <span>返回</span>
                </button>
            </div>
            <section style="float: right;">
                店铺名称：
                <el-select size="small" v-model="shopSelListVal" @change="choseSelList" placeholder="选择店铺">
                    <el-option
                        v-for="item in shopSelList"
                        :label="item.name"
                        :value="item.name">
                    </el-option>
                </el-select>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                当前UID：<span style="color: #606266" v-if="currShopList">{{ currShopList.account_id }}</span>
                <el-input size="small" style="margin-left: 20px" v-model="shopIputId" placeholder="搜索店铺ID">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <!--@click="onSubmit"-->
                <el-button size="small" style="margin-left: 10px" type="primary">搜索</el-button>
            </section>
        </div>
        <section class="content" style="margin: 10px 0;border:1px solid #e2e2e2;padding: 10px">
            <!-- 主体内容 -->
            <div class="clear">
                <div style="float: left">
                    <div>
                        推广目标： <span style="color: #606266">电商网页 </span>
                        <span style="margin-left: 36px"><b style="color: red">*</b> 日限额度 &nbsp;&nbsp;</span>
                        <el-input style="width: 130px" size="small" v-model="daily_budget_1"
                                  placeholder="日限额"></el-input>
                        元
                        <span style="margin-left: 30px">投放模式：</span>
                        <el-switch style="color: #606266"
                                   size="small"
                                   v-model="speed_mode_2"
                                   active-text="加速投放"
                                   inactive-text="标准投放">
                        </el-switch>
                    </div>
                    <div style="margin-top: 10px">
                        落地页：
                        <el-radio v-model="js_ldy_3" label="1">单品页</el-radio>
                        <el-radio v-model="js_ldy_3" disabled label="2">聚合页</el-radio>
                        <el-select style="margin-left: 10px" size="small" v-model="js_ldyName_4" placeholder="活动区域">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </div>
                </div>
                <div style="float: right;margin: 20px">
                    <el-button icon="el-icon-upload" type="danger" @click="upPlan">上传计划</el-button>
                </div>
            </div>
            <section>
                <div class="contentBodyTop">
                    <el-row :gutter="20">
                        <el-col :span="15">
                            <!--disabled-->
                            <el-button @click="copyNewPlan" :disabled="planListData.length === 0"
                                       style="width: 100%;height: 100%" type="primary">复制计划
                            </el-button>
                        </el-col>
                        <el-col :span="9">
                            <!-- -->
                            <el-button @click="beforeCopyAllPlan"
                                       style="width: 100%;height: 100%" type="primary"
                                       :disabled="planListData.length === 0">批量复制计划
                            </el-button>
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
                            type="index"
                            width="90">
                        </el-table-column>
                        <el-table-column
                            prop="SearchDXval_5"
                            label="定向包">
                        </el-table-column>
                        <el-table-column
                            prop="adcreative_template_id"
                            label="资源位">
                        </el-table-column>
                        <el-table-column
                            label="创意">
                            <template slot-scope="scope">
                                <section style="display: inline-block;margin: 0 5px"
                                         v-for="item of scope.row.selectImgObj" v-if="item">
                                    <img v-if="item" class="reg_imgStyle" :src="item.preview_url" alt="">
                                </section>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="排期与出价"
                        >
                            <template slot-scope="scope">
                                <p v-if="scope.row.js_betSetInDate === '1'">长期投放，{{ scope.row.js_longStart }}开始</p>
                                <p v-if="js_betSetInDate === '2'">{{ scope.row.js_betweenStartEnd[0]
                                    }} - {{ scope.row.js_betweenStartEnd[1] }}</p>
                                <p>
                                    <span v-if="scope.row.js_betSetInTime ==='1'">全天投放</span>
                                    <span v-if="scope.row.js_betSetInTime ==='2'">在{{ scope.row.js_showBetTime[0]
                                        }} - {{ scope.row.js_showBetTime[1] }}投放</span>
                                    <span>{{ scope.row.js_betSetStyle | formateBetSetStyle }}</span>
                                    {{ scope.row.js_betSetInDate_6 }}元</p>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="110"
                        >
                            <template slot-scope="scope">
                                <el-button style="margin-left: 5px" @click="reBuildFn( scope.row , scope.$index)"
                                           icon="el-icon-edit"
                                           type="primary" size="small">
                                    编辑
                                </el-button>
                                <el-button @click="delBeforPlan( scope.row , scope.$index )" icon="el-icon-delete"
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
        <el-dialog class="planEdit" :fullscreen=true width="85%" title="计划设置" :visible.sync="showAttentBox" center>
            <section>
                <h4 style="margin-bottom: 20px">定向设置</h4>
                <div v-if="true" class="planEditDX" style="position: relative;">
                    <el-row :gutter="20">
                        <el-col :span="13">
                            <div class="grid-content bg-purple">
                                <p style="padding-bottom: 10px;font-weight: bold">所选定向：<span>{{ SearchDXval_5 }}</span>
                                </p>
                                <section class="planEditDXContent"
                                         style="width: 100%;height: 300px;overflow-y: scroll;border-top: 1px solid #ebfafa">
                                    <p style="margin-top: 10px" v-for="item in setPlanDX">{{ item }}</p>
                                </section>
                            </div>
                        </el-col>
                        <el-col :span="7">
                            <div class="grid-content bg-purple">
                                <el-select style="width: 300px" ref="attentInput" v-model="SearchDXval_5"
                                           @change="getDXID" clearable
                                           filterable
                                           placeholder="搜索定向名称">
                                    <el-option
                                        v-for="item in SearchDXoptions"
                                        :key="item.targeting_id"
                                        :label="item.targeting_name"
                                        :value="item.targeting_name">
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
                            prop="adcreative_template_name"
                            label="广告版位">
                        </el-table-column>
                        <el-table-column
                            prop="adcreative_template_style"
                            label="创意形式">
                        </el-table-column>
                        <el-table-column
                            prop="adcreative_template_desc"
                            label="描述">
                        </el-table-column>
                        <el-table-column
                            prop="adcreative_template_site"
                            label="site">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            label="当前选择 *">
                            <template slot-scope="scope">
                                <i v-if="scope.row.adcreative_template_id === currSelShopListID"
                                   class="el-icon-success"></i>
                            </template>
                        </el-table-column>
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
                    <section>
                        <span v-if="filterData.length > 0"><i style="color: red">*</i> 请选择{{ js_isSureImgNum
                            }}张图：</span>
                        <ul class="clear" v-if="filterData.length > 0">
                            <li v-for="( img ) in filterData" @click="planCYClick( img )">
                                <img class="goodsImg" :class="{opacityImg : !!selectImgObj[img.signature] }"
                                     :src="img.preview_url"
                                     alt="">
                                <p v-if="!!selectImgObj[img.signature]" class="activeSelTip">
                                    <img :src="selectImg" alt="">
                                </p>
                            </li>
                        </ul>
                        <p v-else style="text-align: center;margin: 20px ">
                            暂无数据~
                        </p>
                    </section>
                    <section>
                        <!-- 要求输入的文本 -->
                        <div v-if="js_text.length>0">
                            <section v-for="item in js_text" :class="item.id">
                                <span><b style="color: red">*</b> <span class="js_desc">{{ item.desc }}</span> &nbsp;&nbsp;</span>
                                <el-input style="width: 280px" size="small" :placeholder="item.desc"></el-input>
                                <br/>
                            </section>
                        </div>
                        <!-- 要求输入的url -->
                        <div v-if="js_url.length>0">
                            <section v-for="item in js_url" :class="item.id">
                                <span><b style="color: red">*</b> <span class="js_desc">{{ item.desc }}</span> &nbsp;&nbsp;</span>
                                <el-input style="width: 280px" size="small" :placeholder="item.desc"></el-input>
                                <br/>
                            </section>
                        </div>
                        <!-- 要求的选择 -->
                        <div v-if="js_enumOption.length>0">
                            <section v-for="item in js_enumOption" :class="item.id">
                                <span><b style="color: red">*</b> <span class="js_desc">{{ item.desc }}</span> &nbsp;&nbsp;</span>
                                <el-select v-model="js_test" :placeholder="item.desc">
                                    <el-option
                                        v-for="op in item.options"
                                        :label="op.desc"
                                        :value="op.value">
                                    </el-option>
                                </el-select>
                            </section>
                        </div>
                    </section>
                </div>

            </section>
            <section style="margin-top: 10px;border-top: 2px solid #ccc;padding-top: 10px">
                <h4>排期与出价设置</h4>
                <div>
                    <div class="planEditBottom">
                        投放日期：
                        <el-radio v-model="js_betSetInDate" label="1">长期投放</el-radio>
                        <el-radio v-model="js_betSetInDate" label="2">在日期范围内投放</el-radio>
                    </div>
                    <section style="margin-left: 40px">
                        <div v-if="js_betSetInDate === '1'">
                            <span style="font-size: 12px">开始日期:</span>
                            <el-date-picker
                                v-model="js_longStart"
                                type="date"
                                size="small"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions_Long"
                                placeholder="选择投放开始日期">
                            </el-date-picker>
                        </div>
                        <div style="margin-left: 60px" v-if="js_betSetInDate === '2'">
                            <el-date-picker
                                size="small"
                                v-model="js_betweenStartEnd"
                                type="daterange"
                                align="right"
                                unlink-panels
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions">
                            </el-date-picker>
                        </div>
                    </section>
                    <div class="planEditBottom" style="display: none">
                        投放时间：
                        <el-radio v-model="js_betSetInTime" label="1">全天</el-radio>
                        <el-radio v-model="js_betSetInTime" label="2">特定时间段</el-radio>
                        <section style="margin-top: 10px" v-if="js_betSetInTime === '2'">
                            <el-time-picker
                                is-range
                                size="small"
                                value-format="HH:mm:ss"
                                v-model="js_showBetTime"
                                range-separator="至"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                placeholder="选择时间范围">
                            </el-time-picker>
                        </section>
                    </div>

                    <div class="planEditBottom">
                        出价方式：
                        <el-radio-group v-model="js_betSetStyle">
                            <el-radio :label="1">CPC</el-radio>
                            <el-radio :label="2">CPM</el-radio>
                            <el-radio :label="3">oCPA</el-radio>
                        </el-radio-group>
                    </div>
                    <span style="margin-left: 36px"><b style="color: red">*</b> 出价额度 &nbsp;&nbsp;</span>
                    <el-input style="width: 130px" size="small" v-model="js_betSetInDate_6"
                              placeholder="出价"></el-input>
                    元 <span style="margin-left: 20px;color: #adb6c0">建议出价<b style="color: #1f2d3d">0.58 ~ 0.81</b> 元/点击</span>
                </div>
            </section>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sureSetPlan">确 定</el-button>
                <el-button @click="showAttentBox=false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { mTypes, aTypes } from '~/store/modules/adminPage'
    import selectImg from '~/assets/select.jpg'

    export default {
        data () {
            return {
                js_targeting_id: null, //  下拉框的id

                js_isSureImgNum: 0,
                js_enumOption: [],
                js_text: [],
                js_url: [],
                selectImgObj: {}, // 选者图片用
//                beforeSendPlanArr: [], // 上传之前计划数组

                selectImg: selectImg,
                js_showBetTime: '',
                js_betweenStartEnd: '',
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近一个月',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近三个月',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                            picker.$emit('pick', [start, end])
                        }
                    }]
                },

                js_longStart: '',
                pickerOptions_Long: {
                    disabledDate (time) {
                        return time.getTime() < Date.now()
                    }
                },

                currSelShopListID: '', // 选择的资源id
                currSelShopList: '', // 选择的资源位
                daily_budget_1: 4000000, // 日消耗限额
                speed_mode_2: false, // 投放速度模式，
                js_ldy_3: '1', // 落地页
                js_ldyName_4: '', // ***
                SearchDXval_5: '',
                js_betSetInDate_6: '', //  内部限额

                js_betSetInDate: '1',
                js_betSetInTime: '',
                js_betSetStyle: 1,

                filterData: [],

                shopListData: [],

                showAttentBox: false,

                SearchDXoptions: [],

                shopIputId: '',

                shopSelList: [],
                shopSelListVal: '选择店铺',

                planListData: [], // 计划列表
                openAttention: true,
                isMonitor: false, // 监控
                isAttention: false, // 关注
                shopStateVal: '',

                shop_remark: '',
                remarkBoxVisible: false,

                pageNumber: 1,
                pageSize: 20,

                js_test: '',
                js_templateVal: '',
                end_date: '',
                _index: null, // 记录编辑的位置


                setPlanDX: ['性别：男', '年龄：大于等于41岁', '付费用户：电商交易用户', '商业兴趣：生活用品',
                    '联网方式：Wifi、4G',
                    '地理位置：（常住）中国未知（常住）中国未知、北京市、河北省、北京市、河北省（常住）中国未知、北京市、河北省（常住）中国未知、北京市、河北省']
            }
        },
        watch: {
            shopSelListVal (val) {
                console.log(val)
                console.log('更新页面数据')
                this.$router.push('/adminPage/setPlan/' + val)
            }
        },
        methods: {
        	initBeforePlan(){
                // 初始化 编辑msg
            },
            choseSelList (msg) {
                let obj = {}
                obj = this.shopSelList.find((item) => { // 这里的userList就是上面遍历的数据源
                    return item.name === msg// 筛选出匹配数据
                })
                this.$store.commit(mTypes.setCurrShopList, obj)
            },
            getDXID (msg) {
                let obj = {}
                obj = this.SearchDXoptions.find((item) => { // 这里的userList就是上面遍历的数据源
                    return item.targeting_name === msg// 筛选出匹配数据
                })
                this.js_targeting_id = obj.targeting_id
            },
            replaceMsg (list, domName) {
                let flag = 1
                list.forEach((val, index) => {
                    let currDomName = '.\\#' + domName + index + ' input'
                    let currDomDesc = '.\\#' + domName + index + ' .js_desc'
                    if (document.querySelector(currDomName).value === '') {
                        this.$message({
                            message: '请输入' + document.querySelector(currDomDesc).innerHTML,
                            type: 'error',
                            duration: 1200
                        })
                        flag = 0
                    }
                    if (document.querySelector(currDomName) && this.js_templateVal) {
                        this.js_templateVal = this.js_templateVal.replace('#' + domName + index, document.querySelector(currDomName).value)
                    }
                })
                return flag
            },
            copyNewPlan () {
                if (this.planListData.length > 0) {
                    this.planListData.push(this.planListData[this.planListData.length - 1])
                }
            },
            beforeCopyAllPlan () {
                this.$prompt('请输入复制数量', '批量复制', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^\d+$/,
                    inputErrorMessage: '数量格式不正确'
                }).then(({value}) => {
                    this.copyNewAllPlan(value)
                }).catch(() => {
                })
            },
            copyNewAllPlan (value) {
                let lastPlan = null
                if (this.planListData.length > 0 && this.planListData.length < 30) {
                    lastPlan = this.planListData[this.planListData.length - 1]
                    value = Number(value)
                    for (let i = 0; i < value; i++) {
                        this.planListData.push(lastPlan)
                    }
                }
            },
            delBeforPlan (lineData, index) {
                // 删除 某一列
                if (Number(index) >= 0) {
                    this.planListData.splice(index, 1)
                }
            },
            async upPlan () {
                const loading = this.$loading({
                    lock: true,
                    text: '上传中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.6)'
                })
                let data = {}
                data.plans = this.planListData
                if (data.plans.length > 0) {
                    let upPlanMsg = await this.$store.dispatch(aTypes.updatePlanMsg, data)
                    console.log(upPlanMsg)
                    console.log('-------upPlanMsg ')
                    loading.close()
                    if (upPlanMsg.ok === -2) {
                        this.$message({
                            message: upPlanMsg.message,
                            type: 'error',
                            duration: 1200
                        })
                    } else if (upPlanMsg.ok == 0) {
                        this.$message({
                            message: upPlanMsg.message,
                            type: 'success',
                            duration: 1200
                        })
                    }
                } else {
                    this.$message({
                        message: '请创建计划',
                        type: 'error',
                        duration: 1200
                    })
                }
            },
            planCYClick (imgData) {
                // 选择图片
                this.selectImgObj[imgData.signature] ? this.selectImgObj[imgData.signature] = null : this.selectImgObj[imgData.signature] = imgData
            },

            async listResClick (row) {
                let filterImgData = null

                this.currSelShopListID = row.adcreative_template_id
                this.currSelShopList = row

                if (row.adcreative_template_style) {
                    if (row.adcreative_template_style.indexOf('×') > -1) {
                        filterImgData = await this.$store.dispatch(aTypes.getFilterImg, row.adcreative_template_style.split('×')[0])
                    }
                } else {
                    // 无数据
                    this.filterData = []
                }

                if (filterImgData.code === 0) {
                    this.filterData = filterImgData.data.list
                    this.filterData.forEach((val, index) => {
                        // 设置对象的属性  这样才能双向绑定成功
                        this.$set(this.selectImgObj, val.signature, null)
                    })
                    /* 动态生成结构 */
                    if (row.adcreative_elements) {
                        // 初始化
                        this.js_isSureImgNum = 0
                        this.js_text = []
                        this.js_url = []
                        this.js_enumOption = []

                        /* 图片要求 */
                        if (row.adcreative_elements.images && row.adcreative_elements.images.length > 0) {
                            this.js_isSureImgNum = row.adcreative_elements.images.length
                        }
                        /* 输入框要求 */
                        if (row.adcreative_elements.text && row.adcreative_elements.text.length > 0) {
                            this.js_text = row.adcreative_elements.text
                        }
                        /* url要求 */
                        if (row.adcreative_elements.url && row.adcreative_elements.url.length > 0) {
                            this.js_url = row.adcreative_elements.url
                        }
                        /* option要求 */
                        if (row.adcreative_elements.enum && row.adcreative_elements.enum.length > 0) {
                            this.js_enumOption = row.adcreative_elements.enum
                        }
                    }
                } else {
                    this.$message({
                        message: filterImgData.message,
                        type: 'error',
                        duration: 1200
                    })
                }
            },
            async setPlanAds () {
                this.showAttentBox = true
                let editDXMsg = await this.$store.dispatch(aTypes.getEditDXMsg)
                // 获得焦点 默认打开
                this.$nextTick(function () {
                    this.$refs.attentInput.$el.querySelector('input').focus()
                })
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
                    this.shopListData = editRes.data
                } else {
                    this.$message({
                        message: editRes.message,
                        type: 'error',
                        duration: 1200
                    })
                }
            },
            jump2adminCenter () {
                //  返回
                this.$router.push('/adminPage/adminCenter')
            },
            async reBuildFn (rowMsg, index) {
                //  编辑 todo
                this._index = index
                console.log(rowMsg)
                this.showAttentBox = true
            },
            async sureSetPlan () {
                let currLineObj = {}
                if (this.SearchDXval_5 === '') {
                    this.$message({
                        message: '请选择定向',
                        type: 'error',
                        duration: 1200
                    })
                    // todo 移到指定锚点
                    return false
                }

                if (this.currSelShopList === '') {
                    this.$message({
                        message: '请选择资源位',
                        type: 'error',
                        duration: 1200
                    })
                    return false
                }
                let js_selectImgArr = []
                for (let item in this.selectImgObj) {
                    if (this.selectImgObj[item]) {
                        js_selectImgArr.push(this.selectImgObj[item])
                    }
                }
                console.log(js_selectImgArr)
                if (js_selectImgArr.length === 0) {
                    this.$message({
                        message: '请选择创意图片',
                        type: 'error',
                        duration: 1200
                    })
                    return false
                }
                if (this.js_betSetInDate === '') {
                    this.$message({
                        message: '请选择投放日期',
                        type: 'error',
                        duration: 1200
                    })
                    return false
                }
                if (this.js_betSetInDate === '1' && this.js_longStart === '') {
                    this.$message({
                        message: '请选择长期投放开始日期',
                        type: 'error',
                        duration: 1200
                    })
                    return false
                }
                if (this.js_betSetInDate === '2' && this.js_betweenStartEnd === '') {
                    this.$message({
                        message: '请选择日期范围',
                        type: 'error',
                        duration: 1200
                    })
                    return false
                }
                //                if (this.js_betSetInTime === '') {
                //                    this.$message({
                //                        message: '请选择投放时间',
                //                        type: 'error',
                //                        duration: 1200
                //                    })
                //                    return false
                //                }
                //                if (this.js_betSetInTime === '2' && this.js_showBetTime === '') {
                //                    this.$message({
                //                        message: '请选择时间段',
                //                        type: 'error',
                //                        duration: 1200
                //                    })
                //                    return false
                //                }
                if (this.js_betSetStyle === '') {
                    this.$message({
                        message: '请选择出价方式',
                        type: 'error',
                        duration: 1200
                    })
                    return false
                }
                if (this.js_betSetInDate_6 === '' || !parseFloat(this.js_betSetInDate_6)) {
                    this.$message({
                        message: '请选择出价价格',
                        type: 'error',
                        duration: 1200
                    })
                    return false
                }
                if (this.daily_budget_1 === '' || Number(this.daily_budget_1) < 0 || isNaN(Number(this.daily_budget_1))) {
                    this.$message({
                        message: '请输入正确的日限额',
                        type: 'error',
                        duration: 1200
                    })
                }
                // new  todo
                if (this.currSelShopList && this.currSelShopList.adcreative_elements) {
                    this.js_templateVal = this.currSelShopList.adcreative_elements.template
                    if (Number(this.js_isSureImgNum) !== js_selectImgArr.length) {
                        this.$message({
                            message: '只能选择' + this.js_isSureImgNum + '张图',
                            type: 'error',
                            duration: 1200
                        })
                        return false
                    }
                    if (js_selectImgArr.length > 0) {
                        js_selectImgArr.forEach((val, index) => {
                            if (this.js_templateVal) {
                                this.js_templateVal = this.js_templateVal.replace('#img_' + index, val.image_id)
                            }
                        })
                    }
                    if (this.js_text.length > 0) {
                        let replaceMsgBack = this.replaceMsg(this.js_text, 'txt_')
                        if (!replaceMsgBack) {
                            return false
                        }
                    }
                    if (this.js_url.length > 0) {
                        let replaceMsgBack = this.replaceMsg(this.js_url, 'url_')
                        if (!replaceMsgBack) {
                            return false
                        }
                    }
                    if (this.js_enumOption.length > 0) {
                        let replaceMsgBack = this.replaceMsg(this.js_enumOption, 'enum_')
                        if (!replaceMsgBack) {
                            return false
                        }
                    }
                }
                // new end
                //  selectImgObj: this.selectImgObj, // 创意设置
                console.log(this.js_templateVal)
                /* 投放模式 */
                if (this.speed_mode_2) {
                    this.speed_mode_2 = 'SPEED_MODE_STANDARD'
                } else {
                    this.speed_mode_2 = 'SPEED_MODE_FAST'
                }

                if (this.js_betSetInDate === '1') {
                    this.begin_date = this.js_longStart
                    this.end_date = '2019-12-30'
                } else if (this.js_betSetInDate === '2') {
                    this.begin_date = this.js_betweenStartEnd[0]
                    this.end_date = this.js_betweenStartEnd[1]
                }

                Object.assign(currLineObj, {
                    daily_budget: this.daily_budget_1, // 日限额
                    speed_mode: this.speed_mode,
                    begin_date: this.begin_date,
                    end_date: this.end_date,
                    billing_event: 'BILLINGEVENT_CLICK',
                    bid_amount: this.js_betSetInDate_6,

                    optimization_goal: 'OPTIMIZATIONGOAL_CLICK',
                    targeting_id: this.js_targeting_id, // 定向设置 id,
                    adcreative_template_id: this.currSelShopList.adcreative_template_id,

                    destination_url: 'http://ec.flzhan.cn/?r_id=117575582_b5b9cb0df&pagetype=SINGLE&_bid=2759&qz_gdt=__tracestring__',
                    adcreative_elements: JSON.parse(this.js_templateVal),

                    SearchDXval_5: this.SearchDXval_5, // 定向设置 name
                    //                    currSelShopList: this.currSelShopList, // 资源位设置
                    selectImgObj: this.selectImgObj, // 创意设置

                    js_betSetInDate: this.js_betSetInDate, // 投放日期
                    js_longStart: this.js_longStart, // 投放开始日期

                    js_betweenStartEnd: this.js_betweenStartEnd, // 投放between日期
                    js_betSetInTime: this.js_betSetInTime, // 投放时间
                    js_showBetTime: this.js_showBetTime, // 投放范围时间
                    js_betSetStyle: this.js_betSetStyle, // 出价方式
                    js_betSetInDate_6: this.js_betSetInDate_6 // 出价价格
                    //                    js_templateVal: JSON.parse(this.js_templateVal) // 总的模板

                })
                console.log('dialong 所有数据')
                console.log(currLineObj)
                // 计划表格
                this.planListData.push(currLineObj)
                this.showAttentBox = false
            },

            async searchShopIdFn () {

            }

        },
        computed: {
            currShopList () {
                return this.$store.state.adminPage.currShopList
            }
        },
        async mounted () {
            //   ads_user_list
            let adsMsg = await this.$store.dispatch(aTypes.getAdsUserList, {
                'pageNumber': 1,
                'pageSize': this.pageSize
            })
            if (adsMsg) {
                this.shopSelList = adsMsg.data
            }

            if (this.$route.params.planId != '::planId') {
                this.shopSelListVal = this.$route.params.planId
                let obj = {}
                obj = this.shopSelList.find((item) => { // 这里的userList就是上面遍历的数据源
                    return item.name === this.shopSelListVal// 筛选出匹配数据
                })
                this.$store.commit(mTypes.setCurrShopList, obj)
            } else {
                this.shopSelListVal = '选择店铺'
            }

            // 设置对象的属性  这样才能双向绑定成功  图片选择
            this.js_enumOption.forEach((val, index) => {
                this.$set(this.js_enumOption, val.id, null)
            })
        },
        filters: {
            formateBetSetStyle (val) {
                val = val.toString()
                switch (val) {
                case '1':
                    return 'CPC'

                    break
                case '2':
                    return 'CPM'

                    break
                case '3':
                    return 'oCPA'

                    break
                }
            },
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
    .setPlanCY ul li {
        border: 2px solid #a9a9a9;
        position: relative;
    }

    .setPlanCY ul li .goodsImg {
        display: block;
        width: 130px;
        height: 130px;
    }

    .setPlanCY .opacityImg {
        opacity: 0.4;
    }

    .setPlanCY .activeSelTip {
        display: block;
        position: absolute;
        right: 5px;
        bottom: 5px;
        width: 40px;
        height: 40px;
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
        border: 1px solid transparent;
        float: left;
        margin-left: 20px;
        margin-top: 10px;
        cursor: pointer;
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
