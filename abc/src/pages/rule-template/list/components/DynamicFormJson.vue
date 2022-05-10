<template>
    <div>
        <div class="field-title">
            <span>
                {{ config.label }}
                <el-popover placement="top-start" trigger="hover" :content="config.desc">
                    <i class="el-icon-info opt-a" slot="reference"></i>
                </el-popover>
            </span>
        </div>
        <div class="field-content">
            <div v-for="(item, key) in config.value " :key="key" style="margin: 8px;">
                <span
                    style="display: inline-block; width:200px; text-align: right;vertical-align: middle; padding-right:12px;"
                >
                    {{ item.label }}
                    <el-popover placement="top-start" trigger="hover" :content="item.desc">
                        <i class="el-icon-info opt-a" slot="reference"></i>
                    </el-popover>
                </span>
                <el-input v-model="item.value" style="width: 350px;"></el-input>
            </div>
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
        return {
            fieldValue: {}
        };
    }
};
</script>

<style>
</style>
