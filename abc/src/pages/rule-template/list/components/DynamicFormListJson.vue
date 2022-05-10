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
            <div
                v-for="(item, index) in config.value.data"
                :key="index"
                style="margin: 8px; position: relative; margin-bottom: 26px; "
            >
                <div
                    v-for="(sitem, skey) in config.value.data[index]"
                    :key="config.value.data[index][skey].label"
                    style="margin: 8px 0; "
                >
                    <span
                        style="display: inline-block; width:200px; text-align: right;vertical-align: middle; padding-right:12px;"
                    >
                        {{ config.value.data[index][skey].label }}
                        <el-popover placement="top-start" trigger="hover" :content="sitem.desc">
                            <i class="el-icon-info opt-a" slot="reference"></i>
                        </el-popover>
                    </span>
                    <el-select v-model="config.value.data[index][skey].value"  style="width: 350px;" v-if="config.value.data[index][skey].options">
                        <el-option v-for="(ssitem, ssindex) in config.value.data[index][skey].options" :key="ssindex" :label="ssitem.label" :value="ssitem.value"></el-option>
                    </el-select>
                    <el-input v-model="config.value.data[index][skey].value" style="width: 350px;" v-else></el-input>
                </div>
                <span
                    v-if="!disabled && config.scalable"
                    style="display:inline-block; min-width:70px;position: absolute; top:50%; right: 100px; margin-top: -12px;"
                >
                    <span
                        v-if=" config.value.data.length !==1  && !item.disabled"
                        @click="()=> { config.value.data.splice(index, 1)}"
                    >
                        <d2-icon class="d2-pr-10 d2-pl-10 dynamatic-opt-button" name="remove"/>
                    </span>
                    <span v-if="index=== config.value.data.length-1" @click="add">
                        <d2-icon class="d2-pr-10 d2-pl-10 dynamatic-opt-button" name="plus"/>
                    </span>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
// import _ from 'lodash';
export default {
    inject: {
        elForm: {
            default: ''
        }
    },
    props: {
        config: {
            required: true,
            type: Object
        }
    },
    data() {
        return {
            defaultValue: {},
            initFlag: false
        };
    },
    watch: {
        'config.value.data': {
            immediate: true,
            deep: true,
            handler: function(value) {
                if (!this.initFlag && value.length !== 0) {
                    this.defaultValue = JSON.parse(JSON.stringify(value[0]));
                    this.initFlag = true;
                }
            }
        }
    },
    methods: {
        add: function() {
            this.$set(
                this.config.value.data,
                this.config.value.data.length,
                JSON.parse(JSON.stringify(this.defaultValue))
            );
            this.$forceUpdate();
        }
    },
    computed: {
        disabled() {
            return this.elForm.disabled;
        }
    }
};
</script>

<style>
</style>
