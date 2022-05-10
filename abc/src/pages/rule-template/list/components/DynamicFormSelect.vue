<template>
    <div>
        <span class="field-title-inline">{{ config.label }} ：</span>
        <el-select v-model="config.value"  class="dynamic-input">
            <el-option v-for="(item, index) in config.options" :key="item" :label="item" :value="index"></el-option>
        </el-select>
        <span class="field-desc">
            <i class="el-icon-info"></i>
            {{ config.desc }}
        </span>
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
        return {
            fieldValue: ''
        };
    },
    mounted() {
        console.log(this.config)
    }
};
</script>

<style>
</style>
