<template>
    <div>
        <div class="field-title">
            <span>{{ config.label }} ：</span>
            <span class="field-desc">
                <i class="el-icon-info"></i>
                {{ config.desc }}
            </span>
        </div>
        <div class="field-content">
            <el-radio-group v-model="config.value">
                <el-radio v-for="(item, index) in config.options" :label="index" :key="index">{{ item }}</el-radio>
            </el-radio-group>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        config: {
            required: true,
            type: Object
        }
    },
    data() {
        return {};
    },
    watch: {}
};
</script>

<style>
</style>
