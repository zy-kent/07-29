import utils from '@/libs/util.js';
import { AccountLogin, AccountLogout } from '@api/login';
let { md5 } = utils.crypto;
let { create: uuid } = utils.uuid;

export default {
    namespaced: true,
    actions: {
        /**
         * @description 登录
         * @param {Object} param context
         * @param {Object} param vm {Object} vue 实例
         * @param {Object} param username {String} 用户账号
         * @param {Object} param password {String} 密码
         * @param {Object} param route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
         */
        login({ dispatch, rootState }, { vm, username, password, capcha }) {
            return new Promise((resolve, reject) => {
                // 开始请求登录接口
                const hashPassword = md5(password);
                const token = uuid();
                const timestamp = Math.ceil((rootState.d2admin.timestamp.dTime + new Date().getTime()) / 1000);

                const checksum = md5(`${timestamp}${token}${username}${hashPassword}${capcha}`);
                AccountLogin({
                    username,
                    password: hashPassword,
                    token,
                    timestamp,
                    checksum,
                    capcha
                })
                    .then(async res => {
                        utils.session.set('uuid', username);
                        utils.session.set('token', username);
                        // 设置 vuex 用户信息
                        await dispatch(
                            'd2admin/user/set',
                            {
                                name: username
                            },
                            { root: true }
                        );
                        // 用户登录后从持久化数据加载一系列的设置
                        await dispatch('load');
                        // 结束
                        resolve();
                    })
                    .catch(err => {
                        console.log('err: ', err);
                        reject(err);
                    });
            });
        },
        /**
         * @description 注销用户并返回登录页面
         * @param {Object} param context
         * @param {Object} param vm {Object} vue 实例
         * @param {Object} param confirm {Boolean} 是否需要确认
         */
        logout({ commit }, { vm, confirm = false }) {
            /**
             * @description 注销
             */
            function logout() {
                AccountLogout().then(res => {
                    // 删除cookie
                    utils.session.remove('token');
                    utils.session.remove('uuid');
                    // 跳转路由
                    vm.$router.push({
                        name: 'login'
                    });
                });
            }
            // 判断是否需要确认
            if (confirm) {
                commit('d2admin/gray/set', true, { root: true });
                vm.$confirm('注销当前账户吗?  打开的标签页和用户设置将会被保存。', '确认操作', {
                    confirmButtonText: '确定注销',
                    cancelButtonText: '放弃',
                    type: 'warning'
                })
                    .then(() => {
                        commit('d2admin/gray/set', false, { root: true });
                        logout();
                    })
                    .catch(() => {
                        commit('d2admin/gray/set', false, { root: true });
                    });
            } else {
                logout();
            }
        },
        /**
         * @description 用户登录后从持久化数据加载一系列的设置
         * @param {Object} state vuex state
         */
        load({ commit, dispatch }) {
            return new Promise(async resolve => {
                // DB -> store 加载用户名
                await dispatch('d2admin/user/load', null, { root: true });
                // DB -> store 加载主题
                await dispatch('d2admin/theme/load', null, { root: true });
                // DB -> store 加载页面过渡效果设置
                await dispatch('d2admin/transition/load', null, { root: true });
                // DB -> store 持久化数据加载上次退出时的多页列表
                await dispatch('d2admin/page/openedLoad', null, { root: true });
                // DB -> store 持久化数据加载侧边栏折叠状态
                await dispatch('d2admin/menu/asideCollapseLoad', null, { root: true });
                // DB -> store 持久化数据加载全局尺寸
                await dispatch('d2admin/size/load', null, { root: true });
                // end
                resolve();
            });
        }
    }
};
