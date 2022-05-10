export default {
    name: 'table-mutil-line',
    props: {
        data: {
            type: Array
        }
    },
    render(h) {
        return h(
            'div',
            {},
            this.data.map((item, index) => {
                return this.$scopedSlots.default ? this.$scopedSlots.default({ data: item, index: index }) : h('div', item);
            })
        );
    }
};
