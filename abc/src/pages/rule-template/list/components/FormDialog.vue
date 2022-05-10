<!--
    动态表单
 -->
<template>
    <el-dialog
        :title="config.dialogTitle"
        :visible.sync="config.formVisible"
        append-to-body
        width="900px"
    >
        <div class="dynamic-form">
            <el-form :disabled="config.formType==='preview'">
                <div class="basic-config" v-if="config.formType!=='preview'">
                    <el-form :model="basicInfo" label-width="110px">
                        <el-row :gutter="24">
                            <el-col :span="12">
                                <el-form-item label="规则类别：">
                                    <el-select
                                        v-model="basicInfo.filterName"
                                        :disabled="config.formType!=='create'"
                                        @change="filterChange"
                                    >
                                        <el-option
                                            v-for="type in typeList"
                                            :key="type.filterName"
                                            :label="type.cname || type.filterName"
                                            :value="type.filterName"
                                        ></el-option>
                                    </el-select>
                                    <el-popover
                                        placement="top-start"
                                        width="200"
                                        trigger="hover"
                                        :content="explain"
                                    >
                                        <span
                                            slot="reference"
                                            class="opt-a"
                                            style="cursor: pointer; padding: 0 12px;font-size: 16px;"
                                        >
                                            <i class="el-icon-question"></i>
                                        </span>
                                    </el-popover>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="规则描述：">
                                    <el-input placeholder="请输入规则描述" v-model="basicInfo.describe"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div v-else style="margin: 12px 0;">
                    <el-row :gutter="24">
                        <el-col :span="6">
                            <span style="font-weight:bold;">规则类型：</span>
                            {{data.cname}}
                        </el-col>
                        <el-col :span="18">
                            <span style="font-weight:bold;">规则描述：</span>
                            {{data.describe}}
                        </el-col>
                    </el-row>
                </div>
                <div class="diver"></div>
                <div class="cofig-field" v-loading="fieldLoading" v-if="basicInfo.filterName">
                    <template v-if="configField.length > 0">
                        <div
                            v-for="(field, index) in configField"
                            :key="field.name"
                            class="field-row"
                            :class="{'field-row--first': index===0}"
                        >
                            <!-- 单行输入 数字布尔值文字的信息控件类型  -->
                            <dynamic-form-text
                                v-if="field.input==='text' && (field.type==='int' ||  field.type==='integer'|| field.type==='boolean' || field.type==='string')"
                                :config="field"
                            />
                            <dynamic-form-list
                                v-if="field.input==='text' && field.type==='[string]'"
                                :config="field"
                            />
                            <dynamic-form-list-json
                                v-if="field.input==='text' && field.type==='[json]'"
                                :config="field"
                            />
                            <dynamic-form-json v-if="field.type==='json'" :config="field" />
                            <dynamic-form-select v-if="field.input==='select'" :config="field" />
                            <dynamic-form-checkbox v-if="field.input==='checkbox'" :config="field" />
                            <dynamic-form-radio v-if="field.input==='radio'" :config="field" />
                            <dynamic-form-switch v-if="field.input==='switch'" :config="field" />
                            <dynamic-form-lua v-if="field.input==='code.lua'" :config="field" />
                        </div>
                    </template>
                    <div v-else style="text-indent: 2em; font-size: 12px; color: #ccc;">无可配置参数</div>
                </div>
                <div v-else style="margin-bottom: 12px;">请选择规则类型</div>
            </el-form>
        </div>
        <div slot="footer" style="text-align: center;">
            <el-button type="default" @click="config.formVisible=false" size="mini">关闭</el-button>
            <el-button
                type="primary"
                v-if="config.formType==='create' || config.formType==='copy'"
                @click="createConfig"
                size="mini"
            >新建</el-button>
            <el-button
                type="primary"
                v-if="config.formType==='edit'"
                @click="updateConfig()"
                size="mini"
            >更新</el-button>
            <!-- <el-button type="warning" v-if="config.formType!=='preview'">重置</el-button> -->
        </div>
    </el-dialog>
</template>

<script>
import DynamicFormText from './DynamicFormText';
import DynamicFormList from './DynamicFormList';
import DynamicFormJson from './DynamicFormJson';
import DynamicFormListJson from './DynamicFormListJson';
import DynamicFormSelect from './DynamicFormSelect';
import DynamicFormCheckbox from './DynamicFormCheckbox';
import DynamicFormRadio from './DynamicFormRadio';
import DynamicFormSwitch from './DynamicFormSwitch';
import DynamicFormLua from './DynamicFormLua';

import {
    queryConfigField,
    queryDefaultConfigDetail,
    queryConfigDetailById,
    createConfig,
    updateConfig
} from '@/api/rule-template';

export default {
    props: {
        data: {
            type: Object
        },

        config: {
            type: Object,
            required: true
        }
    },
    components: {
        'dynamic-form-text': DynamicFormText,
        'dynamic-form-list': DynamicFormList,
        'dynamic-form-json': DynamicFormJson,
        'dynamic-form-list-json': DynamicFormListJson,
        'dynamic-form-select': DynamicFormSelect,
        'dynamic-form-checkbox': DynamicFormCheckbox,
        'dynamic-form-radio': DynamicFormRadio,
        'dynamic-form-switch': DynamicFormSwitch,
        'dynamic-form-lua': DynamicFormLua
    },
    data() {
        return {
            title: '规则新增',
            basicInfo: {
                filterName: '',
                describe: ''
            },
            typeList: [],
            configField: [],
            dynamicForm: {},
            canQueryDefaultCof: false,
            defaultFormData: '',
            explain: ''
        };
    },
    methods: {
        // 获取可配置的字段信息
        queryConfigField() {
            queryConfigField()
                .then(res => {
                    this.typeList = res;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        queryDefaultConfigDetail(data) {
            this.fieldLoading = true;
            queryDefaultConfigDetail(data).then(res => {
                this.configField = res;
                this.fieldLoading = false;
                // this.$forceUpdate()
            });
        },
        queryConfigDetailById(data) {
            this.fieldLoading = true;
            queryConfigDetailById(data).then(res => {
                this.configField = res;
                this.fieldLoading = false;
                // this.$forceUpdate()

                // 保存参数副本
                this.defaultFormData =
                    JSON.stringify(this.configField) +
                    JSON.stringify(this.basicInfo.describe);
            });
        },
        async init() {
            this.queryConfigField();
            this.disable = false;
            if (this.config.formType === 'create') {
                // 新增
                this.basicInfo = {
                    filterName: '',
                    describe: ''
                };
                this.configField = [];
            } else if (this.config.formType === 'copy') {
                this.basicInfo = {
                    filterName: this.data.filterName,
                    describe: this.data.describe
                };
                this.explain = this.data.explain;
                this.queryConfigDetailById({ libraryId: this.data.libraryId });
            } else if (this.config.formType === 'edit') {
                this.basicInfo = {
                    filterName: this.data.filterName,
                    describe: this.data.describe
                };
                this.explain = this.data.explain;
                this.queryConfigDetailById({ libraryId: this.data.libraryId });
            } else if (this.config.formType === 'preview') {
                this.disable = true;
                this.basicInfo = {
                    filterName: this.data.filterName,
                    describe: this.data.describe
                };
                this.explain = this.data.explain;
                this.queryConfigDetailById({ libraryId: this.data.libraryId });
            }
        },
        async createConfig() {
            if (!this.basicInfo.filterName) {
                return this.$message.warning('请选择规则类型');
            }
            if (
                this.config.formType === 'copy' &&
                JSON.stringify(this.configField) +
                    JSON.stringify(this.basicInfo.describe) ===
                    this.defaultFormData
            ) {
                await this.$confirm('当前未修改内容, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
            }
            createConfig({
                ...this.basicInfo
                // data: this.configField
            }).then(async res => {
                await this.updateConfig(res.libraryId);
                this.$emit('save');
                this.config.formVisible = false;
            });
        },
        updateConfig(libraryId) {
            updateConfig({
                libraryId: libraryId || this.data.libraryId,
                ...this.basicInfo,
                data: this.configField
            }).then(res => {
                this.$emit('save');
                this.config.formVisible = false;
            });
        },
        filterChange(value) {
            this.explain = this.typeList.filter(
                item => item.filterName === value
            )[0].explain;
        }
    },
    watch: {
        'basicInfo.filterName': {
            handler(filterName) {
                // 请求当前规则类型可配置信息
                if (this.config.formType === 'create') {
                    this.queryDefaultConfigDetail({
                        filterName
                    });
                }
            },
            immediate: true
        },
        'config.formVisible': {
            handler(value) {
                if (value) {
                    this.init();
                }
            },
            immediate: true
        },
        data: {
            handler() {
                this.hasChange = false;
            },
            deep: true
        }
    },
    created() {
        // 加载可配置规则类型
        this.queryConfigField();
    }
};
</script>

<style scoped lang="less">
.field-row {
    margin: 6px 0;
    padding: 6px 0;
    // border-top: 1px solid rgb(235, 245, 238);
    &--first {
        border-top: none;
    }
}
</style>
<style lang="less">
.dynamic-form {
    .field-desc {
        padding-left: 24px;
        i {
            color: #409eff;
        }
    }
    .field-title {
        padding-left: 10px;
        margin-bottom: 18px;
        border-left: 4px solid #409eff;
    }
    .field-title-inline {
        display: inline-block;
        padding-left: 10px;
        border-left: 4px solid #409eff;
        width: 160px;
    }
    .field-content {
        padding-left: 24px;
        .el-input {
            width: 350px;
        }
    }
    .dynamic-input {
        width: 350px;
    }
    .diver {
        background: #ebf5ee;
        height: 1px;
        margin-left: -20px;
        margin-right: -20px;
        margin-bottom: 16px;
    }
    .opt-a {
        padding-left: 12px;
    }
}
</style>
