<template>
    <div>
        <span class="field-title-inline">
            {{ config.label }}
            <el-popover placement="top-start" trigger="hover" :content="config.desc ">
                <i class="el-icon-info opt-a" slot="reference"></i>
            </el-popover>
        </span>
        <el-input
            v-model="fieldValue"
            class="dynamic-input"
            :type="config.type==='int'? 'number' :''"
        ></el-input>
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
    watch: {
        config: {
            handler(value) {
                this.fieldValue = decodeURI(value.value);
            },
            immediate: true,
            deep: true
        },
        fieldValue(value) {
            this.config.value = encodeURI(value);
        }
    }
};
</script>

<style>
</style>
