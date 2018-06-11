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
                <el-input size="small" disabled style="margin-left: 20px" v-model="shopIputId" placeholder="搜索店铺ID">
                    <i slot="prefix" disabled class="el-input__icon el-icon-search"></i>
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
                        <section style="position: relative" class="clear">
                            <div class="block" style="margin-top: 10px;float: left">
                                <el-cascader placeholder="选择落地页"
                                             size="small"
                                             :options="ldy_Options"
                                             v-model="destination_Arr"
                                             :props="ldyProps"
                                             @change="ldy_changeSel">
                                </el-cascader>
                            </div>
                            <p class="css_ldy_p"> 当前落地页： <a target="_blank"
                                                               :href="destination_url">{{ destination_url }}</a></p>
                        </section>

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
                            prop="adcreative_template_desc"
                            label="资源位">
                        </el-table-column>
                        <el-table-column
                            label="创意">
                            <template slot-scope="scope">
                                <section style="display: inline-block;margin: 0 5px"
                                         v-for="item of scope.row.selectImgUrl" v-if="item">
                                    <img v-if="item" class="reg_imgStyle" :src="item" alt="">
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
                                    <template v-for="(val , key) in setPlanDX">
                                        <div v-if="key ==='gender' || key ==='age'||key ==='network_type'">
                                            <p v-if="key ==='gender'" style="margin-top: 10px">性别： <span
                                                v-for="item in val">{{ item | formateMan }}、</span></p>
                                            <p v-if="key ==='age'" style="margin-top: 10px">年龄： <span
                                                v-for="item in val">{{ item }}</span></p>
                                            <p v-if="key ==='network_type'" style="margin-top: 10px">联网方式： <span
                                                v-for="item in val">{{ item }}、 </span></p>
                                        </div>
                                    </template>
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
                    <section v-for="(filterData, idx) in filterDataList">



                        <span><i style="color: red">*</i> 请选择{{ js_isSureImgNumList[idx] }}张{{currSelShopList.adcreative_elements.images[idx]&&(currSelShopList.adcreative_elements.images[idx].width + '*'+ currSelShopList.adcreative_elements.images[idx].height)}}分辨率的{{currSelShopList.adcreative_elements.images[idx]&&currSelShopList.adcreative_elements.images[idx].desc||'图片'}}：</span>
                        <ul class="clear" v-if="filterData.length > 0">
                            <li v-for="( img ) in filterData" @click="planCYClick( img, idx )">
                                <img class="goodsImg" :class="{opacityImg : !!selectImgObjList[idx][img.signature] }"
                                     :src="img.preview_url"
                                     alt="">
                                <p v-if="!!selectImgObjList[idx][img.signature]" class="activeSelTip">
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
                                <el-input :key="item.id" v-if="item.valueTest" @blur="js_TextTest( item , $event )"
                                          :value="item.valueTest"
                                          style="width: 280px" size="small" :placeholder="item.desc"></el-input>
                                <el-input v-else :key="item.desc" @blur="js_TextTest( item , $event )"
                                          style="width: 280px" size="small"
                                          :placeholder="item.desc"></el-input>
                                <br/>
                            </section>
                        </div>
                        <!-- 要求输入的url -->
                        <div v-if="js_url.length>0">
                            <section v-for="item in js_url" :class="item.id">
                                <span><b style="color: red">*</b> <span class="js_desc">{{ item.desc }}</span> &nbsp;&nbsp;</span>
                                <el-input @blur="js_UrlTest" :key="item.id" style="width: 280px" size="small"
                                          :placeholder="item.desc"></el-input>
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
                              @input="check_SetInDate( $event )"
                              placeholder="出价"></el-input>
                    元 <span style="margin-left: 20px;color: #adb6c0">建议出价
                    <span v-if="js_betSetStyle === 1"><b style="color: #1f2d3d">0.6 ~ 1.28</b> 元/点击</span>
                    <span v-if="js_betSetStyle === 2"><b style="color: #1f2d3d">15 ~ 15.4</b> 元/千次曝光</span>
                    <span v-if="js_betSetStyle === 3">（ 自动出价，按照点击或展示扣费 ）</span>
                </span>
                </div>
            </section>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sureSetPlan">确 定</el-button>
                <el-button @click="showAttentBox=false">取 消</el-button>
            </div>
        </el-dialog>
        <el-button style="display:none;" @click="initBeforePlan">初始化</el-button>
    </div>
</template>

<script>
    import { mTypes, aTypes } from '~/store/modules/adminPage'
    import selectImg from '~/assets/select.jpg'

    import { wait } from '~/common/util'
    export default {
        data () {
            return {
                test_textArr: [],
                ldyProps: {
                    // 配置字段
                    label: 'pageName',
                    value: 'pageUrl',
                    children: 'pages'
                },
                destination_url: '', // ***
                destination_Arr: [], // ***
                ldy_Options: [{
                    productName: '资源',
                    pageUrl: 'axure',
                    pages: [{
                        pageUrl: 'axure',
                        productName: 'Axure Components'
                    }, {
                        productName: 'Sketch Templates'
                    }, {
                        pageUrl: 'jiaohu',
                        productName: '组件交互文档'
                    }]
                }],
                js_targeting_id: null, //  下拉框的id

                js_isSureImgNum: 0,
                js_isSureImgNumList: [],
                js_enumOption: [],
                js_text: [],
                js_url: [],
                selectImgObj: {}, // 选者图片用
                //                beforeSendPlanArr: [], // 上传之前计划数组

                selectImgObjList: [],

                selectImg: selectImg,
                js_showBetTime: '',
                js_betweenStartEnd: '',
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近一个月',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近三个月',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * 90)
                            picker.$emit('pick', [start, end])
                        }
                    }]
                },

                js_longStart: this.format( new Date()),
                pickerOptions_Long: {
                    disabledDate (time) {
                        return time.getTime() < Date.now()
                    }
                },
                currSelShopListID: '', // 选择的资源id
                currSelShopList: '', // 选择的资源位
                daily_budget_1: 4000000, // 日消耗限额
                speed_mode_2: true, // 投放速度模式，
                js_ldy_3: '1', // 落地页
                SearchDXval_5: '',
                js_betSetInDate_6: '', //  内部限额
                js_betSetInDate: '1',
                js_betSetInTime: '',
                js_betSetStyle: 1,

                filterData: [],

                filterDataList: [],
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

                rebuildMsg: {}, // build
                billing_event: '',
                optimization_goal: '',

                setPlanDX: {
                    age: ['暂无描述~'],
                    gender: ['暂无描述~'],
                    network_type: ['暂无描述~']
                }
            }
        },
        watch: {
            shopSelListVal (val) {
                //	  console.log('更新页面数据')
                this.$router.push('/adminPage/setPlan/' + val)
            }
        },
        methods: {
            check_SetInDate (_evt) {
                let reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/
                if (!reg.test(_evt)) {
                    this.$message({
                        message: '请输入正确的价格',
                        type: 'error',
                        duration: 2000
                    })
                }
            },
            js_TextTest (currItem, _this) {
                if (currItem && _this && _this.target) {
                    if (_this.target.value.length < currItem.min || _this.target.value.length > currItem.max) {
                        this.$message({
                            message: currItem.desc + ' 要求' + currItem.min + '~' + currItem.max + '个文字',
                            type: 'error',
                            duration: 2000
                        })
                        return false
                    }
                }
            },
            js_UrlTest (currItem, _this) {
                if (currItem && _this && _this.target) {
                    if (!currItem.reg(_this.target.value)) {
                        this.$message({
                            message: currItem.desc + '格式不正确',
                            type: 'error',
                            duration: 2000
                        })
                        return false
                    }
                }
            },
            ldy_changeSel (ldy) {
                if (ldy[1]) {
                    this.destination_url = ldy[1]
                }
            },
            initBeforePlan () {
                // 初始化 编辑msg todo
                this.SearchDXval_5 = ''
                this.shopListData = []
                this.currSelShopListID = ''
                this.currSelShopList = ''
                this.js_isSureImgNum = 0
                this.js_isSureImgNumList = []

                this.filterData = []
                this.filterDataList = []
                this.selectImgObj = {}
                this.selectImgObjList = []

                this.js_enumOption = []
                this.js_text = []
                this.js_url = []

                this.js_betSetInDate = '1'
                this.js_longStart = ''
                this.js_betweenStartEnd = ''
                this.js_betweenStartEnd = []

                this.js_betSetStyle = 1
                this.js_betSetInDate_6 = ''
            },
            replaceMsg (list, domName, requireTextArr) {
                let flag = 1
                list.forEach((val, index) => {
                    let currDomName = '.\\#' + domName + index + ' input'
                    let currDomDesc = '.\\#' + domName + index + ' .js_desc'
                    let js_inputVal = document.querySelector(currDomName).value
                    if (js_inputVal === '') {
                        this.$message({
                            message: '请输入' + document.querySelector(currDomDesc).innerHTML,
                            type: 'error',
                            duration: 1200
                        })
                        flag = 0
                    }

                    if (domName === 'txt_' && requireTextArr[index]) {
                        if (js_inputVal.length < requireTextArr[index].min || js_inputVal.length > requireTextArr[index].max) {
                            this.$message({
                                message: requireTextArr[index].desc + '要求' + requireTextArr[index].min + '~' + requireTextArr[index].min + '个字符',
                                type: 'error',
                                duration: 2000
                            })
                            flag = 0
                        }
                    }

                    if (document.querySelector(currDomName) && this.js_templateVal) {
                        this.js_templateVal = this.js_templateVal.replace('#' + domName + index, js_inputVal)
                        val.valueTest = js_inputVal
                    }
                })
                return flag
            },
            async upPlan () {
                let data = {}
                data.plans = JSON.parse(JSON.stringify(this.planListData))
                if (data.plans.length > 0) {
                    const loading = this.$loading({
                        lock: true,
                        text: '上传计划中...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.6)'
                    })
                    data.plans.forEach((val, index) => {
                        if (val.bid_amount !== undefined) {
                            val.bid_amount = Number(val.bid_amount) * 100
                        }
                        delete val.filterData
                        delete val.filterDataList
                        delete val.shopListData
                        delete val.selectImgObj
                        delete val.selectImgObjList
                        delete val.currSelShopList
                        delete val.js_betSetInDate_6
                        delete val.SearchDXval_5
                    })
                    let upPlanMsg = await this.$store.dispatch(aTypes.updatePlanMsg, data)
                    loading.close()
                    if (upPlanMsg.code !== 200) {
                        console.error(upPlanMsg.data);
                        this.$message({
                            message: upPlanMsg.message,
                            type: 'error',
                            duration: 1200
                        })
                    } else{
                        this.$message({
                            message: upPlanMsg.message,
                            type: 'success',
                            duration: 1200
                        })

                        this.planListData = []
                    }
                } else {
                    this.$message({
                        message: '请创建计划',
                        type: 'error',
                        duration: 1200
                    })
                }
            },
            planCYClick (imgData, idx) {
                // 选择图片
                let js_selectImgArr = []
                if( !this.selectImgObjList[idx][imgData.signature] ){
                    for (let item in this.selectImgObjList[idx]) {
                        if (this.selectImgObjList[idx][item]) {
                            js_selectImgArr.push(this.selectImgObjList[idx][item])
                        }
                    }
                    if (Number(this.js_isSureImgNumList[idx]) === js_selectImgArr.length) {
                        this.$message({
                            message: '只能选择' + this.js_isSureImgNumList[idx] + '张图',
                            type: 'error'
                        })
                        return false
                    }
                }
                this.selectImgObjList[idx][imgData.signature] ? this.selectImgObjList[idx][imgData.signature] = null : this.selectImgObjList[idx][imgData.signature] = imgData;
            },
            async listResClick (row) {
                let filterImgData = null;
                let filterImgList = [];
                this.currSelShopListID = row.adcreative_template_id
                this.currSelShopList = row


                if(row.adcreative_elements.images) {
                    filterImgList = await Promise.all(
                        row.adcreative_elements.images.map(imgs => this.$store.dispatch(aTypes.getFilterImg, [imgs.width, imgs.height]))
                    )
                }

                this.filterDataList = filterImgList.map(filter => filter.data.list).map((item, idx) => (item.map(item=>item).filter(it => it.file_size<row.adcreative_elements.images[idx].maxsize)));

                let selectImgObjList = []
                this.filterDataList.forEach(filterData => {
                    let selectImgObj = {}

                    filterData.forEach((val, index) => {
                        // 设置对象的属性  这样才能双向绑定成功
                        selectImgObj[val.signature] = null

                    })
                    selectImgObjList.push(selectImgObj);
                })
                this.selectImgObjList = selectImgObjList
                /* 动态生成结构 */
                if (row.adcreative_elements) {
                    // 初始化
                    this.js_isSureImgNumList = []
                    this.js_text = []
                    this.js_url = []
                    this.js_enumOption = []
                    /* 图片要求 */
                    if (row.adcreative_elements.images && row.adcreative_elements.images.length > 0) {
                        this.js_isSureImgNumList = row.adcreative_elements.images.map(item => item.ids.length)
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
                if (editRes.code === 0 || editRes.code === '200') {
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
                this.rebuildMsg = rowMsg

                /* 动态生成结构 */
                if (rowMsg.currSelShopList.adcreative_elements) {
                    // 初始化
                    this.js_isSureImgNum = 0
                    this.js_isSureImgNumList = []
                    this.js_text = []
                    this.js_url = []
                    this.js_enumOption = []
                    /* 图片要求 */
                    if (rowMsg.currSelShopList.adcreative_elements.images && rowMsg.currSelShopList.adcreative_elements.images.length > 0) {
                        this.js_isSureImgNum = rowMsg.currSelShopList.adcreative_elements.images.length
                    }
                    /* 图片要求 */
                    if (rowMsg.currSelShopList.adcreative_elements.images && rowMsg.currSelShopList.adcreative_elements.images.length > 0) {
                        this.js_isSureImgNumList = rowMsg.currSelShopList.adcreative_elements.images.map(item => item.ids.length)

                    }
                    /* 输入框要求 */
                    if (rowMsg.currSelShopList.adcreative_elements.text && rowMsg.currSelShopList.adcreative_elements.text.length > 0) {
                        this.js_text = rowMsg.currSelShopList.adcreative_elements.text
                    }
                    /* url要求 */
                    if (rowMsg.currSelShopList.adcreative_elements.url && rowMsg.currSelShopList.adcreative_elements.url.length > 0) {
                        this.js_url = rowMsg.currSelShopList.adcreative_elements.url
                    }
                    /* option要求 */
                    if (rowMsg.currSelShopList.adcreative_elements.enum && rowMsg.currSelShopList.adcreative_elements.enum.length > 0) {
                        this.js_enumOption = rowMsg.currSelShopList.adcreative_elements.enum
                    }
                }
                if (Object.keys(rowMsg).length > 0) {
                    this.daily_budget_1 = rowMsg.daily_budget
                    this.speed_mode = rowMsg.speed_mode
                    this.begin_date = rowMsg.begin_date
                    this.end_date = rowMsg.end_date
                    this.billing_event = rowMsg.billing_event
                    this.js_betSetInDate_6 = rowMsg.bid_amount
                    this.optimization_goal = rowMsg.optimization_goal
                    this.js_targeting_id = rowMsg.targeting_id
                    this.currSelShopList = rowMsg.currSelShopList
                    this.destination_url = rowMsg.destination_url
                    this.adcreative_elements = rowMsg.adcreative_elements
                    this.SearchDXval_5 = rowMsg.SearchDXval_5
                    this.selectImgObj = rowMsg.selectImgObj
                    this.selectImgObjList = rowMsg.selectImgObjList
                    this.js_betSetInDate = rowMsg.js_betSetInDate
                    this.js_longStart = rowMsg.js_longStart
                    this.js_betweenStartEnd = rowMsg.js_betweenStartEnd
                    this.js_betSetInTime = rowMsg.js_betSetInTime
                    this.js_betSetStyle = rowMsg.js_betSetStyle
                    this.filterData = rowMsg.filterData
                    this.filterDataList = rowMsg.filterDataList
                    this.shopListData = rowMsg.shopListData
                    this.currSelShopListID = rowMsg.currSelShopListID
                }
                this.showAttentBox = true
            },
            async sureSetPlan () {
                // 设置计划
                let currLineObj = {}
                if (this.SearchDXval_5 === '') {
                    this.$message({
                        message: '请选择定向',
                        type: 'error'
                    })
                    // todo 移到指定锚点
                    return false
                }

                if (this.currSelShopList === '') {
                    this.$message({
                        message: '请选择资源位',
                        type: 'error'
                    })
                    return false
                }

                let imgflag = false;
                this.selectImgObjList.some(selectImgObj => {
                    let js_selectImgArr = []
                    for (let item in selectImgObj) {
                        if (selectImgObj[item]) {
                            js_selectImgArr.push(selectImgObj[item])
                        }
                    }
                    if (js_selectImgArr.length === 0) {
                        this.$message({
                            message: '请选择创意图片',
                            type: 'error'
                        });
                        imgflag = true;
                        return true
                    }
                })
                if(imgflag) {
                    return false
                }

                if (this.js_betSetInDate === '') {
                    this.$message({
                        message: '请选择投放日期',
                        type: 'error'
                    })
                    return false
                }
                if (this.js_betSetInDate === '1' && this.js_longStart === '') {
                    this.$message({
                        message: '请选择长期投放开始日期',
                        type: 'error'
                    })
                    return false
                }
                if (this.js_betSetInDate === '2' && this.js_betweenStartEnd === '') {
                    this.$message({
                        message: '请选择日期范围',
                        type: 'error'
                    })
                    return false
                }
                //                if (this.js_betSetInTime === '') {
                //                    this.$message({
                //                        message: '请选择投放时间',
                //                        type: 'error'
                //                    })
                //                    return false
                //                }
                //                if (this.js_betSetInTime === '2' && this.js_showBetTime === '') {
                //                    this.$message({
                //                        message: '请选择时间段',
                //                        type: 'error'
                //                    })
                //                    return false
                //                }
                if (this.js_betSetStyle === '') {
                    this.$message({
                        message: '请选择出价方式',
                        type: 'error'
                    })
                    return false
                }
                if (this.js_betSetInDate_6 === '' || !parseFloat(this.js_betSetInDate_6)) {
                    this.$message({
                        message: '请选择出价价格',
                        type: 'error'
                    })
                    return false
                }
                if (this.daily_budget_1 === '' || Number(this.daily_budget_1) < 0 || isNaN(Number(this.daily_budget_1))) {
                    this.$message({
                        message: '请输入正确的日限额',
                        type: 'error'
                    })
                }

                let selectImgUrl = []
                // new  todo
                if (this.currSelShopList && this.currSelShopList.adcreative_elements) {
                    let images = this.currSelShopList.adcreative_elements.images
                    this.js_templateVal = this.currSelShopList.adcreative_elements.template
                    this.test_textArr = this.currSelShopList.adcreative_elements.text


                    let imgflag = false;
                    this.selectImgObjList.forEach((selectImgObj, idx) => {
                        let js_selectImgArr = []
                        Object.keys(selectImgObj).forEach(key => {
                            if(selectImgObj[key]) {
                                selectImgUrl.push(selectImgObj[key].preview_url)
                                js_selectImgArr.push(selectImgObj[key]);
                                images[idx].ids.forEach((id, index) => {
                                    this.js_templateVal = this.js_templateVal.replace(id, selectImgObj[key].image_id)
                                })
                            }
                        });


                        if (Number(this.js_isSureImgNumList[idx]) !== js_selectImgArr.length) {
                            this.$message({
                                message: `只能选择${this.js_isSureImgNum}张${images[idx].width}*${images[idx].height}分辨率的图`,
                                type: 'error'
                            })
                            imgflag = true;
                            return true
                        }
                    });
                    if(imgflag) return false;

                    if (this.js_text.length > 0) {
                        let replaceMsgBack = this.replaceMsg(this.js_text, 'txt_', this.test_textArr)
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

                console.log(this.js_templateVal)
                Object.assign(currLineObj, {
                    daily_budget: this.daily_budget_1, // 日限额
                    speed_mode: this.speed_mode_2,
                    begin_date: this.begin_date,
                    end_date: this.end_date,
                    billing_event: 'BILLINGEVENT_CLICK',
                    bid_amount: this.js_betSetInDate_6,

                    optimization_goal: 'OPTIMIZATIONGOAL_CLICK',
                    targeting_id: this.js_targeting_id, // 定向设置 id,
                    adcreative_template_id: this.currSelShopList.adcreative_template_id,
                    adcreative_template_desc: this.currSelShopList.adcreative_template_desc,
                    currSelShopList: this.currSelShopList,
                    destination_url: this.destination_url,
                    adcreative_elements: JSON.parse(this.js_templateVal), // 总的模板

                    SearchDXval_5: this.SearchDXval_5, // 定向设置 name
                    //                    currSelShopList: this.currSelShopList, // 资源位设置
                    // selectImgObj: this.selectImgObj, //  创意设置
                    selectImgObjList: this.selectImgObjList, //  创意设置
                    selectImgUrl: selectImgUrl,

                    js_betSetInDate: this.js_betSetInDate, // 投放日期
                    js_longStart: this.js_longStart, // 投放开始日期

                    js_betweenStartEnd: this.js_betweenStartEnd, // 投放between日期
                    js_betSetInTime: this.js_betSetInTime, // 投放时间
                    js_showBetTime: this.js_showBetTime, // 投放范围时间
                    js_betSetStyle: this.js_betSetStyle, // 出价方式
                    js_betSetInDate_6: this.js_betSetInDate_6, // 出价价格

                    filterData: this.filterData,
                    filterDataList: this.filterDataList,
                    shopListData: this.shopListData,
                    currSelShopListID: this.currSelShopListID

                })
                console.log('dialog 所有数据')
                console.log(currLineObj)
                // 计划表格
                if (this._index === undefined || this._index === null) {
                    this.planListData.push(currLineObj)
                } else {
                    //                    替换数组
                    this.planListData.splice(Number(this._index), 1, currLineObj)
                }
                this.showAttentBox = false
            },
            async searchShopIdFn () {
            },
            choseSelList (msg) {
                // 代理商变化
                let obj = {}
                obj = this.shopSelList.find((item) => {
                    return item.name === msg// 筛选出匹配数据
                })
                this.$store.commit(mTypes.setCurrShopList, obj)
                this.upLdyList()
                this.planListData = [] // 置空
            },
            getDXID (msg) {
                let obj = {}
                obj = this.SearchDXoptions.find((item) => {
                    return item.targeting_name === msg // 筛选出匹配数据
                })
                this.setPlanDX = obj.targeting
                this.js_targeting_id = obj.targeting_id
            },
            copyNewPlan () {
                if (this.planListData.length > 0) {
                    this.planListData.unshift(JSON.parse(JSON.stringify(this.planListData[this.planListData.length - 1])))
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
                        this.planListData.unshift(JSON.parse(JSON.stringify(lastPlan)))
                    }
                }
            },
            delBeforPlan (lineData, index) {
                // 删除 某一列
                if (Number(index) >= 0) {
                    this.planListData.splice(index, 1)
                }
            },
            async upLdyList () {
                let ldyMsg = await this.$store.dispatch(aTypes.getldyList)
                if (ldyMsg) {
                    if (ldyMsg.data.length > 0) {
                        ldyMsg.data.forEach((val, index) => {
                            if (val.pages[0]) {
                                val.pageUrl = val.pages[0].pageId;
                            } else {
                                val.pageUrl = val.productId;
                            }
                            val.pageName = val.productName;
                        })
                    }
                    if (ldyMsg.data[0] && ldyMsg.data[0].pages) {
                        this.destination_url = ldyMsg.data[0].pages[0].pageUrl
                        this.destination_Arr = [ldyMsg.data[0].pageUrl, ldyMsg.data[0].pages[0].pageUrl]
                    }
                    this.ldy_Options = ldyMsg.data
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
        },
        computed: {
            currShopList () {
                return this.$store.state.adminPage.currShopList
            }
        },
        async mounted () {
            //   ads_user_list
            let adsMsg = null
            if (this.$store.state.userList) {
                adsMsg = await this.$store.dispatch(aTypes.getAdsUserList, {
                    'pageNumber': 1,
                    'pageSize': this.pageSize,
                    'qqUsername': this.$store.state.userList.qqUsername.trim()
                })
                if (adsMsg) {
                    this.shopSelList = adsMsg.data
                }
            } else {
                this.$message({
                    message: '请重新登陆',
                    type: 'error',
                    duration: 1200
                })
                await wait(500)
                this.$router.push('/login')
                return false
            }

            if (this.$route.params.planId != '::planId') {
                this.shopSelListVal = this.$route.params.planId
                let obj = {}
                obj = this.shopSelList.find((item) => { // 这里的userList就是上面遍历的数据源
                    return item.name === this.shopSelListVal// 筛选出匹配数据
                })
                this.$store.commit(mTypes.setCurrShopList, obj)
                // 更新落地页 模板
                this.upLdyList()
            } else {
                this.shopSelListVal = '选择店铺'
            }
            // 设置对象的属性  这样才能双向绑定成功  图片选择
            this.js_enumOption.forEach((val, index) => {
                this.$set(this.js_enumOption, val.id, null)
            })
        },
        filters: {
            formateMan (val) {
                //                FEMALE
                if (val === 'MALE') {
                    return '男'
                } else if (val === 'FEMALE') {
                    return '女'
                }
                return '暂无描述~'
            },
            formateBetSetStyle (val) {
                val = val.toString()
                switch (val) {
                case '1':
                    return 'CPC'
                case '2':
                    return 'CPM'
                case '3':
                    return 'oCPA'
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
    .css_ldy_p {
        float: right;
        height: 40px;
        line-height: 40px;
        margin-left: 10px;
        margin-top: 5px;
        font-size: 12px;
    }

    .css_ldy_p a:hover {
        color: #6dbbff;
    }

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
