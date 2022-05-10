
<template>
    <el-popover
        placement="bottom-start"
        trigger="click"
        popper-class="table-custom-header"
        @hide="search"
    >
        <el-input v-model="value" size="mini" @keyup.enter.native="search"></el-input>
        <span slot="reference" style="cursor: pointer;">
            {{ label }}
            <d2-icon name="caret-down"></d2-icon>
        </span>
    </el-popover>
</template>

<script>
export default {
    name: 'search-header', // 表头搜索
    props: {
        label: {
            // 表头显示名字
            type: String,
            required: true
        },
        labelKey: {
            // 标识符
            type: String,
            required: true
        },
        handler: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            value: '',
            hasChange: true
        };
    },
    watch: {
        value() {
            this.hasChange = true;
        }
    },
    methods: {
        // 触发查询
        search() {
            if (this.hasChange) {
                this.handler({
                    label: this.label,
                    key: this.labelKey,
                    value: this.value
                });
            }
            this.hasChange = false;
        }
    }
};
</script>
