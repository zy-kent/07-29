import { getDomainEntryMappingData } from '@api/logger'

export default {
    namespaced: true,
    state: {
        // 域和入口映射
        domainEntryMapping: []
    },
    actions: {
        /**
         * @description 获取域和入口映射数据
         * @param {Object} state vuex state
         */
        getDomainEntryMapping({ commit }) {
            return new Promise(async (resolve, reject) => {
                getDomainEntryMappingData().then(res => {
                    const domainEntryMapping = res
                    commit('getDomainEntryMapping', { domainEntryMapping })
                    resolve(domainEntryMapping)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    },
    mutations: {
        getDomainEntryMapping(state, { domainEntryMapping }) {
            state.domainEntryMapping = domainEntryMapping
        }
    },
    getters: {
        domainList: (state) => { return state.domainEntryMapping }
    }
}
