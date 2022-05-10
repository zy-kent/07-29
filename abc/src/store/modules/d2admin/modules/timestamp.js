import { timeSync } from '@/api/login';
export default {
    namespaced: true,
    state: {
        dTime: '' // 客户端和服务端时间戳差值
    },
    actions: {
        /**
         * @description 获取设置差值
         * @param {Object} state vuex state
         * @param {Number} dTime 差值
         */
        init({ state, dispatch }) {
            return new Promise(async resolve => {
                // store 赋值
                const preTime = new Date();
                const serverTime = (await timeSync()).timestamp;
                const afterTime = new Date();
                state.dTime = Math.ceil(serverTime * 1000 - (afterTime - preTime) / 2) - preTime;
                // 持久化
                await dispatch(
                    'd2admin/db/set',
                    {
                        dbName: 'sys',
                        path: 'dTime.value',
                        value: state.dTime,
                        user: true
                    },
                    { root: true }
                );
                // end
                resolve();
            });
        },
        /**
         * @description 从持久化数据读取实时间戳差值设置
         * @param {Object} state vuex state
         */
        load({ state, dispatch }) {
            return new Promise(async resolve => {
                // store 赋值
                state.dTime = await dispatch(
                    'd2admin/db/get',
                    {
                        dbName: 'sys',
                        path: 'dTime.value',
                        defaultValue: 0,
                        user: true
                    },
                    { root: true }
                );
                // end
                resolve();
            });
        }
    }
};
