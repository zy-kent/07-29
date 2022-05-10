<template>
    <div>
        <div class="handle-wrap">
            <template v-if="config.data.length>0">
                <div
                    v-for="(field, index) in config.data"
                    :key="field.name"
                    class="field-row"
                    :class="{'field-row--first': index===0}"
                >
                    <dynamic-form :field="field"></dynamic-form>
                </div>
            </template>
            <div v-else style="padding-top: 12px; padding-left: 20px;">无可配置参数</div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import { queryActionParams, queryActionParamsById } from '@api/rule-config';
import DynamicForm from '../../../rule-template/list/components/DynamicForm';
export default {
    props: {
        config: {
            type: Object
        }
    },
    components: {
        'dynamic-form': DynamicForm
    },
    data() {
        return {
            actionList: [],
            configField: [],
            initFlag: false
        };
    },
    watch: {
        'config.actionName': {
            handler(val) {
                // 查询默认参数
                if (val) {
                    if (this.config.actionId) {
                        if (this.initFlag) {
                            queryActionParams(val).then(res => {
                                this.$set(this.config, 'data', res);
                            });
                        }
                    } else {
                        queryActionParams(val).then(res => {
                            this.$set(this.config, 'data', res);
                        });
                    }
                }
            },
            immediate: true
        }
    },
    created() {
        if (this.config.actionId) {
            // 查询已经配置的参数
            queryActionParamsById(this.config.actionId).then(res => {
                this.$set(this.config, 'data', res);
                // this.config.data = res;
                this.initFlag = true;
            });
        }
    }
};
</script>

<style scoped lang="less">
.field-row {
    margin: 6px 6px;
    padding: 6px 0;
    border-top: 1px solid rgb(235, 245, 238);
    &--first {
        border-top: none;
    }
}
</style>
