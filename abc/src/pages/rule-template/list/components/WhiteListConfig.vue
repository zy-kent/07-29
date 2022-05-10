<template>
    <div style="color:#606266;">
        <section>
            <p v-if="whiteList.length===0 && !disableEdit">
                规则为空，请
                <span
                    @click="()=> { whiteList.push({value: '', errorInfo: '',describe:''}) }"
                >添加
                    <d2-icon class="d2-pr-10 d2-pl-10 dynamatic-opt-button" name="plus"/>
                </span>
            </p>
            <el-row v-for="(item,index) in whiteList" :key="index" class="form-row">
                <el-col :span="8">
                    <span class="form-text">匹配正则：</span>
                    <el-input
                        v-model="item.value"
                        size="mini"
                        style="width:70%;"
                        @blur="validateWhiteList(index)"
                        :disabled="disableEdit"
                        :title="item.value"
                        :class="{'error-input': item.errorInfo}"
                    ></el-input>
                </el-col>
                <el-col :span="9">
                    <span class="form-text">备注：</span>
                    <el-input
                        v-model="item.describe"
                        size="mini"
                        style="width:70%;"
                        :title="item.describe"
                        :disabled="disableEdit"
                    ></el-input>
                    <span v-if="!disableEdit">
                        <span @click="()=> { whiteList.splice(index, 1)}">
                            <d2-icon class="d2-pr-10 d2-pl-10 dynamatic-opt-button" name="remove"/>
                        </span>
                        <span
                            @click="()=> { whiteList.push({value: '', errorInfo: '',describe:'', disabled: false}) }"
                            v-if="index=== whiteList.length-1"
                        >
                            <d2-icon class="d2-pr-10 d2-pl-10 dynamatic-opt-button" name="plus"/>
                        </span>
                    </span>
                </el-col>
                <el-col :span="7" class="error-info" v-show="item.errorInfo">{{ item.errorInfo }}</el-col>
            </el-row>
        </section>
    </div>
</template>

<script>
export default {
    props: {
        whiteList: {
            type: Array,
            required: true
        },
        disabled: {
            type: Boolean
        }
    },
    data() {
        return {};
    },
    computed: {
        disableEdit() {
            return this.$route.query.preview || this.disabled;
        }
    },
    watch: {},
    methods: {
        // 校验
        validateWhiteList(index) {
            let errormsg = '请填写正确的正则表达式';
            if (index !== undefined) {
                try {
                    this.$set(this.whiteList[index], 'errorInfo', '');
                    if (this.whiteList[index].value) {
                        new RegExp(this.whiteList[index].value);
                    }
                } catch (error) {
                    this.$set(this.whiteList[index], 'errorInfo', errormsg);
                    return false;
                }
                return true;
            } else {
                let flag = true;
                this.whiteList.forEach(item => {
                    try {
                        this.$set(item, 'errorInfo', '');
                        if (item.value) {
                            new RegExp(item.value);
                        }
                    } catch (error) {
                        this.$set(item, 'errorInfo', errormsg);
                        flag = false;
                    }
                });
                return flag;
            }
        }
    }
};
</script>

<style lang="less" scoped>
.dynamatic-opt-button {
    font-size: 16px;
    cursor: pointer;
    color: #409eff;
    &:hover {
        transition: all 0.3s;
        color: #1783f3;
    }
}
.form-row {
    margin: 8px;
}
.form-text {
    font-size: 14px;
}
.input-wrap {
    display: inline-block;
}
.error-info {
    height: 12px;
    line-height: 28px;
    font-size: 12px;
    color: #f56c6c;
}
.error-input {
}
</style>
