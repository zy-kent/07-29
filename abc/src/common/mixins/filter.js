import _ from 'lodash';
export default {
    data() {
        return {
            filterItems: [], // 筛选的条件
            defaultRequestParams: {} // 保存参数默认值
        };
    },
    methods: {
        /**
         *  设置筛选条件
         * @param {*} value 冒号后面的值
         * @param {*} key 条件标志
         * @param {*} label 冒号前面显示的值
         */
        setFilterItems({ value, key, label }) {
            let filterItemIndex = _.findIndex(this.filterItems, o => o.key === key);
            let item = { label, value, key };
            // 有 替换值
            if (filterItemIndex > -1) {
                if (value) {
                    this.$set(this.filterItems, filterItemIndex, item);
                } else {
                    this.filterItems.splice(filterItemIndex, 1);
                }
            } else {
                // 无 新增加末尾
                if (value) {
                    this.filterItems.push(item);
                }
            }
        },

        removeListFilter(index, item) {
            // 移除请求参数
            if (item.key.indexOf('_time') !== -1) {
                // 时间类型的请求参数
                this.resetParams(`start_${item.key}`);
                this.resetParams(`end_${item.key}`);
            } else {
                this.resetParams(item.key);
            }
            this.queryList(1);
        },
        // 重置请求参数
        resetParams(key, defaultValue) {
            // 重置所有值
            if (_.isArray(key)) {
                return (this.requestParams = this.defaultRequestParams);
            }
            if (defaultValue) {
                this.requestParams[key] = defaultValue;
            } else {
                // 重置到默认值
                this.requestParams[key] = this.defaultRequestParams[key] || '';
            }
        }
    },
    created() {
        this.defaultRequestParams = JSON.parse(JSON.stringify(this.requestParams));
    }
};
