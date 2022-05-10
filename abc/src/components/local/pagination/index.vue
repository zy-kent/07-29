<template>
    <el-pagination
        class="d2-fr d2-mt-10"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="data.pageIndex"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="5"
        :layout="layout"
        :total="data.total"
    ></el-pagination>
</template>

<script>
export default {
    name: 'pagination',
    props: {
        layout: {
            type: String,
            default: 'total, sizes, prev, pager, next, jumper'
        },
        data: {
            type: Object,
            required: true
        },
        change: {
            type: Function,
            required: true
        }
    },
    methods: {
        // 分页大小变化触发
        handleSizeChange(size) {
            this.change({
                pageSize: size
            });
        },
        // 页码变化
        handleCurrentChange(pageIndex) {
            this.change({
                pageIndex
            });
        }
    }
};
</script>
