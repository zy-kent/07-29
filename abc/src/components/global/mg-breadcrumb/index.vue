<template>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 12px;">
        <!-- <el-breadcrumb-item :to="{ path: '/index'}">首页</el-breadcrumb-item> -->
        <el-breadcrumb-item
            v-for="item in breadcrumb"
            :key="item.path"
            :to="{ path: item.path }"
        >{{ item.meta.title }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    name: 'mg-breadcrumb',
    props: {
        data: Object
    },
    computed: {
        breadcrumb() {
            if (this.data) {
                return this.data.filter(item => item.meta.title);
            } else {
                return this.$route.matched.filter(item => item.meta.title);
            }
        }
    }
};
</script>
