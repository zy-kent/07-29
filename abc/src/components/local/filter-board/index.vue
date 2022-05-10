<!--
@name: 筛选条件显示
@description:
    1. 传入 filterItems 数组
    2. 通过带作用域的函数传值，不采用事件传值
    props 看props 注释
@author: yangjiaxun
@date: 2018/08/01
-->
<template>
    <div class="filter-board d2-ml-10">
        <span v-show="filterItems.length > 0">筛选条件：</span>
        <div v-for="(item, i) in filterItems" :key="item.key" class="filter-board-item">
            <span class="text">{{ item.label }}：{{ item.value }}</span>
            <span class="remove" @click="onremove(i, item)">
                <d2-icon name="times"></d2-icon>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Filter-Board',
    props: {
        removeFilterLabel: {
            // 箭头函数传入，绑定父组件的this
            type: Function,
            required: true
        },
        filterItems: {
            // 筛选显示数组
            type: Array,
            required: true
        }
    },
    data() {
        return {};
    },
    methods: {
        /**
         * 删除标签
         * @param {object} item 标签元信息
         * @param {number} i 标签index
         */
        onremove(index, item) {
            this.filterItems.splice(index, 1);
            this.removeFilterLabel(index, item);
        }
    }
};
</script>

<style lang="less" scope>
.filter-board {
    display: inline-block;
    font-size: 12px;
    color: #757a86;
}
.filter-board-item {
    display: inline-block;
    margin-left: 10px;
    margin-right: 10px;
    border: 1px solid #cbe2ff;
    padding: 4px 6px;
    transition: all 0.3s ease;
    &:hover {
        border: 1px solid #539eff;
    }
}
.remove {
    cursor: pointer;
    margin-left: 6px;
    transition: all 0.3s ease;
    &:hover {
        color: #539eff;
    }
}
</style>
