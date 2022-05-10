<template>
    <div>
        <span class="field-title-inline">
            {{ config.label }}
            <el-popover placement="top-start" trigger="hover" :content="config.desc ">
                <i class="el-icon-info opt-a" slot="reference"></i>
            </el-popover>
        </span>
        <div id="dynamic-editor" style="display: block; vertical-align: text-top; height: 400px; width: 100%; margin: 20px auto 10px; border: 1px solid #ccc;" ></div>
    </div>
</template>

<script>
import AceEditor from 'brace';
import 'brace/mode/lua';
// import 'brace/theme/light';
export default {
    props: {
        config: {
            required: true,
            type: Object
        }
    },
    data() {
        return {
            fieldValue: '',
            editor: ''
        };
    },
    watch: {
        'config.value': {
            handler(value) {
                this.editor.setValue(decodeURI(value));
            }
        }
    },
    mounted() {
        this.editor = AceEditor.edit('dynamic-editor');
        this.editor.getSession().setMode('ace/mode/lua');
        // this.editor.setTheme('ace/theme/light');
        this.editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true // 设置自动提示
        });

        this.editor.setValue(decodeURI(this.config.value));
        this.editor.on('blur', () => {
            this.config.value = encodeURI(this.editor.getValue());
        });
        this.editor.setShowPrintMargin(false);
    }
};
</script>

<style>
</style>
