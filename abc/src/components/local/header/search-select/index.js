export default {
    name: 'search-select-header', // 表头搜索下拉选择，单选或多选
    props: {
        name: {
            // 表头显示名字
            type: String,
            required: true
        },
        labelKey: {
            // 标识符
            type: String,
            required: true
        }
    },
    render(h) {
        return h('span', {}, this.name);
    }
};
