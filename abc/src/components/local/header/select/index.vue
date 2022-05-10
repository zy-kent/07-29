
<template>
    <div class="custom-table-header">
        <el-select
            v-model="value"
            @change="search"
            @visible-change="clearValue"
            class="custom-table-header-select"
            size="mini"
            ref="select"
        >
            <el-option
                v-for="item in list"
                :key="item.lable"
                :value="item[prop.value]"
                :label="item[prop.label]"
            />
        </el-select>
        <span slot="reference" class="custom-header-select-label">
            {{ label }}
            <d2-icon name="caret-down"></d2-icon>
        </span>
    </div>
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
        },
        list: {
            type: Array,
            required: true
        },
        prop: {
            type: Object,
            default() {
                return {
                    value: 'value',
                    lable: 'label'
                };
            }
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
        },
        clearValue() {
            this.value = '';
        }
    }
};
</script>
