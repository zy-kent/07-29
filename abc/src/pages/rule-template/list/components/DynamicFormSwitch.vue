<template>
    <div>
        <div class="field-title">
            <span>{{ config.label }} ：</span>
            <el-switch
                v-model="config.value"

            ></el-switch>
            <span class="field-desc">
                <i class="el-icon-info"></i>
                {{ config.desc }}
            </span>
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
