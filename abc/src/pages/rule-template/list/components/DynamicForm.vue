<template>
    <div class="dynamic-form">
        <!-- 单行输入 数字布尔值文字的信息控件类型  -->
        <dynamic-form-text
            v-if="field.input==='text' && (field.type==='int' ||  field.type==='integer'|| field.type==='boolean' || field.type==='string')"
            :config="field"
        />
        <dynamic-form-list v-if="field.input==='text' && field.type==='[string]'" :config="field" />
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
export default {
    props: {
        field: Object
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
    }
};
</script>

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
}
</style>
