<template>
    <el-container>
        <el-main>
            <p class="loginTitle">飞马智能营销系统</p>
            <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="70px"
                     class="demo-ruleForm">
                <el-form-item label="账号" prop="name">
                    <el-input v-model.number="ruleForm2.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pass">
                    <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm2')">登陆</el-button>
                    <el-button @click="resetForm('ruleForm2')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
    import { wait } from '../common/util'
    export default {
        data () {
            var checkName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('账号不能为空'))
                }
                setTimeout(() => {
                    //  处理规则
                    callback()
                }, 10)
            }
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else {
                    if (this.ruleForm2.checkPass !== '') {
                        //  处理字符等
                    }
                }
                callback()
            }
            return {
                ruleForm2: {
                    pass: '',
                    name: ''
                },
                rules2: {
                    pass: [{validator: validatePass, trigger: 'blur'}],
                    name: [{validator: checkName, trigger: 'blur'}]
                }
            }
        },
        methods: {
            submitForm (formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        (async () => {
                            try {
                                console.log(this.ruleForm2)
                                let loginMsg = await this.$store.dispatch('login', this.ruleForm2)
                                console.log(loginMsg)
                                if (loginMsg.code === 200) {
                                    this.$message({
                                        message: '登录成功',
                                        type: 'success',
                                        duration: 1200
                                    })
                                    this.$store.commit('setUserList', loginMsg.data);
                                    await this.$store.dispatch('adminModule/getAdsUserListRefresh', {qqUsername:this.ruleForm2.name })
                                    await wait(500)
                                    this.$router.replace('/adminPage/adminCenter')
                                } else {
                                    this.$message({
                                        message: loginMsg.message,
                                        type: 'error',
                                        duration: 1200
                                    })
                                    this.ruleForm2.pass = ''
                                }
                                //                                if (this.ruleForm2.name === 'admin123' && this.ruleForm2.pass === 'a123456') {
                                //                                    this.$message({
                                //                                        message: '登录成功',
                                //                                        type: 'success',
                                //                                        duration: 1200
                                //                                    })
                                //                                    await wait(1200)
                                //                                    this.$router.replace('/adminPage/adminCenter')
                                //                                } else {
                                //                                    this.$message({
                                //                                        message: '账号或密码错误',
                                //                                        type: 'error',
                                //                                        duration: 1200
                                //                                    })
                                //                                    await wait(1200)
                                //                                }

                                return false
                            } catch (e) {
                                this.$message({
                                    message: e.message,
                                    type: 'error',
                                    duration: 1200
                                })
                            }
                        })()
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            resetForm (formName) {
                this.$refs[formName].resetFields()
            }
        }
    }
</script>
<style scoped>
    .el-main {
        color: #333;
        line-height: 60px;
        font-size: 14px;
        max-width: 600px;
        margin: 80px auto;
    }

    .el-main .loginTitle {
        text-align: center;
        font-size: 18px;
    }
</style>
