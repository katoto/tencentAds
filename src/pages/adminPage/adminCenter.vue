<template>
    <div class="app-container">
        <section>
            <div>
                <section class="clear">
                    <div style="float: left">
                        <span style="font-weight: 700;font-size: 20px">店铺管理中心</span>
                        <el-select style="margin-left: 30px" size="small" v-model="shopStateVal" placeholder="所有店铺">
                            <el-option
                                    v-for="item in shopState"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div style="float: right">
                        <el-input v-model="searchUid" size="small" placeholder="搜索店铺ID"></el-input>
                        <el-button style="margin-left: 10px" @click="searchShopIdFn()" type="primary" plain
                                   size="small">
                            查询
                        </el-button>
                        <el-button @click="initShopList()" type="warning" size="small">
                            重置
                        </el-button>
                    </div>
                </section>
                <el-table
                        :data="shopListData"
                        stripe
                        highlight-current-row
                        style="width: 100%">
                    <el-table-column
                            prop="shopName"
                            label="店铺名称">
                    </el-table-column>
                    <el-table-column
                            prop="totalConsume"
                            :formatter="formatConsumeFn"
                            label="总消耗">
                    </el-table-column>
                    <el-table-column
                            prop="banlance"
                            label="余额">
                    </el-table-column>
                    <el-table-column
                            prop="conversionCost"
                            label="转化成本">
                    </el-table-column>
                    <el-table-column
                            label="关注操作"
                            width="110"
                    >
                        <template slot-scope="scope">
                            <!--el-icon-star-on-->
                            <el-button v-if="!isAttention" @click="attentionFn( scope.row )" icon="el-icon-star-off"
                                       type="primary"
                                       size="small">
                                关注
                            </el-button>
                            <el-button v-else @click="attentionFn( scope.row )" icon="el-icon-star-on" type="primary"
                                       size="small">
                                已关注
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="监控操作"
                            width="110"
                    >
                        <template slot-scope="scope">
                            <el-button v-if="!isMonitor" @click="monitorFn( scope.row )" icon="el-icon-news"
                                       type="warning" size="small">
                                监控
                            </el-button>
                            <el-button v-else @click="monitorFn( scope.row )" icon="el-icon-news" type="warning"
                                       size="small">
                                监控中
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="新建操作"
                            width="110"
                    >
                        <template slot-scope="scope">
                            <el-button @click="addShopFn( scope.row )" icon="el-icon-circle-plus-outline" type="primary"
                                       size="small">
                                新建
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="添加备注"
                            width="110"
                    >
                        <template slot-scope="scope">
                            <el-button @click="addRemarkFn( scope.row )" icon="el-icon-edit" type="primary"
                                       size="small">
                                备注
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="shopOperate"
                            label="当前店铺状态"
                            width="130"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="shopRemark"
                            label="备注"
                            width="130"
                    >
                    </el-table-column>
                </el-table>
                <div class="block">
                    <el-pagination
                            @current-change="handleCurrentChange"
                            background
                            :current-page.sync="pageNumber"
                            size="small"
                            :page-size="pageSize"
                            layout="prev, pager, next,jumper"
                            :page-count="pageCounts"
                    >
                    </el-pagination>
                </div>
            </div>
        </section>
        <!-- 提款申请 -->
        <!-- 提款审核的操作弹窗 -->
        <el-dialog title="添加备注" center :visible.sync="remarkBoxVisible">
            <div>
                <span>请输入备注内容:</span>
                <el-input style="margin-left: 10px" placeholder="请输入备注" v-model='shop_remark'></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="surePay">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="全店新计划监控" :visible.sync="showAttentBox" center>
            <section>
                <h2 style="margin-bottom: 20px">监控设置</h2>
                <div class="" style="position: relative;">
                    <form class="el-form el-form--label-right el-form--inline">
                        <div class="el-form-item is-required"><label class="el-form-item__label">转换成本：</label>
                            <div class="el-form-item__content">
                                <div class="el-input el-input-group el-input-group--append">
                                    <input type="text" class="el-input__inner" autocomplete="off" value="50">
                                    <div size="small" class="el-input-group__append">元</div>
                                </div>
                            </div>
                        </div>
                        <div class="el-form-item is-required"><label class="el-form-item__label">消耗：</label>
                            <div class="el-form-item__content">
                                <div class="el-input el-input-group el-input-group--append">
                                    <input type="text" class="el-input__inner" autocomplete="off" value="2000">
                                    <div size="small" class="el-input-group__append">元</div>
                                </div>
                            </div>
                        </div>
                        <div class="el-form-item is-required"><label
                                class="el-form-item__label">浮动率&nbsp;&nbsp;：</label>
                            <div class="el-form-item__content">
                                <div class="el-input el-input-group el-input-group--append">
                                    <input type="text" class="el-input__inner" autocomplete="off" value="0">
                                    <div class="el-input-group__append">%</div>
                                </div>
                            </div>
                        </div>
                        <el-switch
                                v-model="openAttention"
                                active-text="关启监控"
                                inactive-text="开启监控">
                        </el-switch>
                    </form>
                </div>
            </section>
            <section style="margin-top: 10px;border-top: 2px solid #ccc;padding-top: 10px">
                <h2>监控消息</h2>
                <p style="color: #9b9b9b;text-align: center;line-height: 100px;">该店铺内的新计划暂无变更</p>
                <!-- todo-->
            </section>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="surePay">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
	import {mTypes, aTypes} from '~/store/modules/adminPage'
	export default {
		data(){
			return {
				openAttention: true,
				isMonitor: false, // 监控
				isAttention: false, // 关注
				shopStateVal: '',
				shopState: [{
					value: '1',
					label: '关注的店铺'
				}, {
					value: '2',
					label: '监控的店铺'
				}, {
					value: '3',
					label: '在投的店铺'
				}],
				shopListData: [{ //  数据模拟
					shopName: '宜昌小覃同学电子',
					totalConsume: 90400,
					banlance: 20,
					conversionCost: 1,
					shopOperate: '关注中',
					shopRemark: ''
				}, { //  数据模拟
					shopName: '湖南省求喜茶业',
					totalConsume: 14000,
					banlance: 20,
					conversionCost: 1,
					shopOperate: '监控中',
					shopRemark: '123'
				}, { //  数据模拟
					shopName: '武夷山茗掌柜茶业',
					totalConsume: 1200,
					banlance: 20,
					conversionCost: 1,
					shopOperate: '在投中',
					shopRemark: '观察'
				}, { //  数据模拟
					shopName: '武夷山茗掌柜茶业',
					totalConsume: 1200,
					banlance: 20,
					conversionCost: 1,
					shopOperate: '在投中',
					shopRemark: '观察'
				}
				],
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
			sendEth(Msg){
				// 发起转账
				if (typeof web3 !== 'undefined') {
					web3.eth.sendTransaction({
						from: '0xFFb9511C95570F2156EeBf7371Fb0e52038B1006',
						to: Msg.withdraw_addr,
						value: web3.toWei(Number(Msg.amount), 'ether'),   // The value transferred for the transaction in wei
						gas: 31000,
						data: web3.toHex(Msg.uid + '$' + Msg.oid),
					}, function (err, hash) {
						console.log(hash);
					})

				} else {
					this.$message({
						message: '请手动调起metamask插件',
						type: 'error',
						duration: 1200
					})
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
					surePayBack = await
					this.$store.dispatch(aTypes.setWithDrawReview, this.currLineData);
				} else {
					surePayBack = await
					this.$store.dispatch(aTypes.setWithDrawReview, this.currLineData);
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
				let msgTop = await
				this.$store.dispatch(aTypes.getWithdrawProfit, data.uid);
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
				let msgBottom = await
				this.$store.dispatch(aTypes.getAccountDetail, {
					uid: data.uid,
					pageNumber: 1,
					pageSize: this.userPageSize
				});
				this.showAttentBox = true;

			},
			async searchShopIdFn(){
				if (!this.searchUid) {
					return false;
				}
				let withDrawMsg = await
				this.$store.dispatch(aTypes.getWithdrawOrder, {
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
					withDrawMsg = await
					this.$store.dispatch(aTypes.getWithdrawOrder, {
						'pageNumber': Number(val),
						'pageSize': this.pageSize,
						'uid': this.searchUid
					})
				} else {
					withDrawMsg = await
					this.$store.dispatch(aTypes.getWithdrawOrder, {
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
					msgBottom = await
					this.$store.dispatch(aTypes.getAccountDetail, {
						'pageNumber': Number(val),
						'pageSize': this.userPageSize,
						'uid': this.currUserUid
					})
				} else {
					msgBottom = await
					this.$store.dispatch(aTypes.getAccountDetail, {
						'pageNumber': Number(val),
						'pageSize': this.userPageSize
					})
				}

				if (msgBottom) {
					this.userPageNumber = Number(msgBottom.currentPage);
					this.userMsgCounts = Number(msgBottom.pages);
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
			let withDrawMsg = await
			this.$store.dispatch(aTypes.getWithdrawOrder, {
				'pageNumber': 1,
				'pageSize': this.pageSize
			})
			if (withDrawMsg) {
				this.pageCounts = Number(withDrawMsg.pages);
				this.pageNumber = Number(withDrawMsg.currentPage);
			}

			if (typeof web3 !== 'undefined') {
				console.log(web3.currentProvider)
				console.log(3)
				console.log(web3.version)
//      区块信息
//        web3.eth.getBlock(48, function (error, result) {
//          if (!error)
//            console.log(JSON.stringify(result));
//          else
//            console.error(error);
//        })
//      账号 address 0xa4B6CE77E56C10f2cAf11BaAe7416612C5EC98b0
//				web3.eth.getAccounts(function (error, account) {
//					if (!error) {
//						console.log(account)
//						console.log(JSON.stringify(account));
//						console.log(account[0]);
//						console.log(']]]]]]]]]]]]]]]')
//						web3.eth.getBalance(account[0], function (err, data) {
//							console.log(data)
//						})
//
//					} else
//						console.error(error);
//				})

//        web3.eth.sendTransaction({
//          from: '0xa4b6ce77e56c10f2caf11baae7416612c5ec98b0',
//          to: '0xc69c7ac91826e1146cb7740534ed554ebd0c5805',
//          value: web3.toWei(0.01,'ether'),   // The value transferred for the transaction in wei
//          gas: 31000,
//          data: web3.toHex('123'),
//        },function (err, hash) {
//          console.log(hash);
//        })

			} else {
				web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
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
