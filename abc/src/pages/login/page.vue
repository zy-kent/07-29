<template>
    <div class="page-login">
        <div class="page-login-left"></div>
        <div class="page-login-right">
            <router-link to="/login">
                <img
                    src="./image/logo.png"
                    alt="logo"
                    style="margin-top: 20px;"
                    title="咪咕营销防刷系统"
                    width="234"
                />
            </router-link>
            <div class="page-login--form">
                <el-card shadow="never">
                    <el-form
                        ref="loginForm"
                        label-position="top"
                        :rules="rules"
                        :model="formLogin"
                        size="default"
                        @submit.native.prevent
                    >
                        <el-form-item prop="username">
                            <el-input type="text" v-model="formLogin.username" placeholder="请输入用户名">
                                <i slot="prepend" class="fa fa-user-circle-o"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input
                                type="password"
                                v-model="formLogin.password"
                                placeholder="请输入密码"
                            >
                                <d2-icon slot="prepend" name="eye-slash"></d2-icon>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="capcha">
                            <el-input type="text" v-model="formLogin.capcha" placeholder="请输入验证码">
                                <i slot="prepend" class="fa fa-keyboard-o"></i>
                                <template slot="append">
                                    <img
                                        :src="validateImgCodeUri"
                                        ref="codeImageDom"
                                        class="login-code"
                                        alt="验证码"
                                        @click="onChangeValidateImgCode"
                                        width="120"
                                        height="35"
                                    />
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-button
                            size="default"
                            native-type="submit"
                            @click="submit"
                            :disabled="submitBtnDisabled"
                            type="primary"
                            class="button-login"
                        >登录</el-button>
                        <div class="form-login-opt">
                            <!-- <p class="form-login-opt--item">
                                <router-link class="forget-pwd-a" to="/forget-password">
                                    <d2-icon name="question-circle"/>&nbsp;&nbsp;忘记密码
                                </router-link>
                            </p>-->
                            <p class="form-login-opt--item">
                                <el-checkbox v-model="formLogin.savePwd">记住密码</el-checkbox>
                            </p>
                        </div>
                    </el-form>
                </el-card>
            </div>
            <p class="footer-info-des">Copyright &copy; 2019 咪咕文化科技有限公司</p>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import NProgress from 'nprogress';

export default {
    data() {
        return {
            submitBtnDisabled: false,
            validateImgCodeUri: '/mgsgw/capcha/get', // 验证码图片
            logoUrl: '',
            // 表单
            formLogin: {
                username: localStorage.getItem('username') || '',
                password: localStorage.getItem('password') || '',
                capcha: '',
                savePwd: false
            },
            // 校验
            rules: {
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 20,
                        message: '长度在 2 到 20 个字符',
                        trigger: 'blur'
                    }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    {
                        min: 6,
                        max: 20,
                        message: '长度在 6 到 20 个字符',
                        trigger: 'blur'
                    }
                ],
                capcha: [
                    {
                        required: true,
                        message: '请输入验证码',
                        trigger: 'blur'
                    },
                    {
                        min: 4,
                        max: 4,
                        message: '请输入正确的验证码',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        ...mapActions('d2admin/account', ['login']),
        onChangeValidateImgCode: function(e) {
            this.formLogin.capcha = '';
            this.validateImgCodeUri = `/mgsgw/capcha/get?${new Date().getTime()}`;
        },
        /**
         * @description 提交登录信息
         */
        submit() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    // 登录
                    this.login({
                        vm: this,
                        username: this.formLogin.username,
                        password: this.formLogin.password,
                        capcha: this.formLogin.capcha
                    })
                        .then(res => {
                            if (this.formLogin.savePwd) {
                                localStorage.setItem(
                                    'username',
                                    this.formLogin.username
                                );
                                localStorage.setItem(
                                    'password',
                                    this.formLogin.password
                                );
                            }
                            if (this.$route.query.redirect === 'kibana') {
                                location.href = '/kibana';
                            }
                            this.$router.replace(
                                // this.$route.query.redirect ||
                                '/base-config/index'
                            );
                            this.$refs.codeImageDom.click();
                        })
                        .catch(error => {
                            this.$refs.codeImageDom.click();
                            if (error.code === -5 || error.code === -6) {
                                return this.$notify.error('用户名或密码错误!');
                            } else if (error.code === -7) {
                                return this.$notify.error('验证码错误!');
                            } else {
                                return this.$notify.error('请刷新页面重试!');
                            }
                        });
                } else {
                    // 登录表单校验失败
                    this.$message.error('表单校验失败');
                }
            });
        }
    },
    created() {
        // 防止多次请求导致的重复调用会话超时函数，重复请求当前页面，导致进度条不会消失的bug
        NProgress.done();
    }
};
</script>
<style lang="less" scoped>
.page-login {
    display: flex;
    height: 100vh;
}
.page-login-right {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    padding: 20px;
    height: 100%;
    box-sizing: border-box;
    width: 487px;
    flex: 0 0 auto;
}
.page-login--form {
    padding: 0 45px;
}
.footer-info-des {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    text-align: center;
}
.button-login {
    width: 100%;
}
.form-login-opt {
    font-size: 14px;
    display: flex;
    width: 100%;
    justify-content: space-between;
}
.form-login-opt--item {
    margin-bottom: 0px;
}
.forget-pwd-a {
    color: #409eff;
}
.page-login-left {
    flex: 99 99 auto;
    align-items: stretch;
    background: url(./image/login-backgroud.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.login-code {
    height: 35px;
    width: 90px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    cursor: pointer;
}
</style>

<style lang="less" >
// 重写UI样式
.page-login {
    .el-input-group__prepend {
        background: none;
    }
    .el-input-group__append {
        padding-left: 0;
        padding-right: 0;
        background: inherit;
    }
}
</style>
