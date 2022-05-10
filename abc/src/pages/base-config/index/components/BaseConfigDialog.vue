<template>
    <el-dialog
        @open="initForm"
        :visible="formVisible"
        width="600px"
        @close="closeDialog"
        :close-on-click-modal="false"
    >
        <div slot="title" style="color: #606266;">
            {{modalTitle}}
            <el-popover placement="top-start" title="填写说明：" width="500" trigger="hover">
                <form-info>
                </form-info>
                <span class="form-help" slot="reference">
                    <d2-icon name="question-circle-o" title="详细填写说明" />
                </span>
            </el-popover>
        </div>
        <div class="base-config-form">
            <el-form label-width="100px" ref="form" :model="form">
                <el-form-item
                    label="业务名称："
                    prop="serviceName"
                    :rules="[{ required: true, message: '请输入服务名称', trigger: 'blur'}]"
                >
                    <el-input
                        v-model="form.serviceName"
                        size="small"
                        style="width: 80%;"
                    >
                    </el-input>

                </el-form-item>

                <el-form-item
                    label="网站域名："
                    prop="domainName"
                    :rules="[{required: true}]"
                >
                    <div v-for="(item, index) in form.domainName" :key="item + index">
                        <el-input
                            v-model="item.value"
                            style="width: 80%;"
                            size="mini"
                            @blur="valiateDomain"
                            placeholder="格式 host:port"
                        ></el-input>
                        <span style="display:inline-block; min-width:70px;">
                            <span
                                v-if="form.domainName.length !==1"
                                @click="()=> { form.domainName.splice(index, 1)}"
                            >
                                <d2-icon
                                    class="d2-pr-10 d2-pl-10 dynamatic-opt-button"
                                    name="remove"
                                />
                            </span>
                            <span
                                @click="()=> { form.domainName.push({value: '', errorInfo: ''}) }"
                                v-if="index=== form.domainName.length - 1"
                            >
                                <d2-icon
                                    class="d2-pr-10 d2-pl-10 dynamatic-opt-button"
                                    name="plus"
                                />
                            </span>
                        </span>
                        <div class="error-info" style="line-height: 1;">{{ item.errorInfo }}</div>
                    </div>
                </el-form-item>

                <el-form-item
                    label="域类型："
                    prop="isSsl"
                    :rules="[{ required: true, message: '请选择域类型'}]"
                >
                    <el-radio-group v-model="form.isSsl" @change="handleChangePortType">
                        <el-radio :label="false">http</el-radio>
                        <el-radio :label="true">https</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item
                    v-if="form.isSsl"
                    label="证书路径："
                    prop="cer"
                    :rules="[{ required: true, message: '请输入证书路径'}]"
                >
                    <el-input
                        placeholder="请输入证书路径"
                        size="small"
                        v-model="form.cer"
                        style="width: 80%;"
                    ></el-input>
                </el-form-item>

                <el-form-item
                    v-if="form.isSsl"
                    label="公钥路径："
                    prop="cer"
                    :rules="[{ required: true, message: '请输入证书路径'}]"
                >
                    <el-input
                        placeholder="请输入公钥路径"
                        size="small"
                        v-model="form.key"
                        style="width: 80%;"
                    ></el-input>
                </el-form-item>

                <el-form-item
                    label="映射端口："
                    prop="listenPort"
                    :rules="[{ required: true, message: '请选择映射端口'}]"
                >
                    <el-select v-model="form.listenPort"
                            size="small"
                            style="width: 80%;">
                        <el-option v-for="port in nginxPortList" :key="port"  :label="port" :value="port"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    label="网站入口："
                    prop="entryList"
                    :rules="[{ required: true, message: '请输入网站入口', trigger: 'blur'}]"
                >
                    <div v-for="(item, index) in form.entryList" :key="item+index">
                        <el-input
                            v-model="item.value"
                            style="width: 80%;"
                            size="mini"
                            @blur="valiateEntry"
                            :disabled="item.disabled"
                            :class="{ 'error-input': item.errorInfo }"
                        ></el-input>
                        <span style="display:inline-block; min-width:70px;">
                            <span
                                v-if="form.entryList.length !==1 && !item.disabled"
                                @click="()=> { form.entryList.splice(index, 1)}"
                            >
                                <d2-icon
                                    class="d2-pr-10 d2-pl-10 dynamatic-opt-button"
                                    name="remove"
                                />
                            </span>
                            <span
                                @click="()=> { form.entryList.push({value: '/', errorInfo: '', disabled: false}) }"
                                v-if="index=== form.entryList.length-1"
                            >
                                <d2-icon
                                    class="d2-pr-10 d2-pl-10 dynamatic-opt-button"
                                    name="plus"
                                />
                            </span>
                            <span v-if="item.disabled" @click="unlockFormItem(index, 'entryList')">
                                <d2-icon
                                    name="unlock-alt"
                                    class="d2-pr-10 d2-pl-10 dynamatic-opt-button"
                                ></d2-icon>
                            </span>
                        </span>
                        <div class="error-info" style="line-height: 1;">{{ item.errorInfo }}</div>
                    </div>
                </el-form-item>
                <el-form-item
                    label="服务器IP："
                    prop="targets"
                    :rules="[{ required: true, message: '请输入服务器IP', trigger: 'blur'}]"
                >
                    <div v-for="(item, index) in form.targets" :key="index">
                        <el-input
                            v-model="item.target"
                            style="width: 50%;"
                            size="mini"
                            @blur="valiateIP"
                            :disabled="item.disabled"
                            placeholder="服务器IP"
                            :class="{ 'error-input': item.errorInfo }"
                        ></el-input>
                        <span style="display: inline-block; width: 5%;"></span>
                        <el-input
                            type="number"
                            v-model="item.weight"
                            style="width: 25%;"
                            size="mini"
                            min="0"
                            @blur="valiateIP"
                            placeholder="权重"
                            :disabled="item.disabled"
                            :class="{ 'error-input': item.errorInfo }"
                        ></el-input>
                        <span style="display:inline-block; min-width:70px;">
                            <span
                                v-if=" form.targets.length !==1  && !item.disabled"
                                @click="()=> {
                                    form.targets.splice(index, 1);
                                }"
                            >
                                <d2-icon
                                    class="d2-pr-10 d2-pl-10 dynamatic-opt-button"
                                    name="remove"
                                />
                            </span>
                            <span
                                v-if="index=== form.targets.length-1"
                                @click="()=> {
                                    form.targets.push({target: '', weight: '',  errorInfo: '', disabled: false});
                                }"
                            >
                                <d2-icon
                                    class="d2-pr-10 d2-pl-10 dynamatic-opt-button"
                                    name="plus"
                                />
                            </span>
                            <span
                                v-if="item.disabled"
                                @click="()=>{
                                    unlockFormItem(index, 'targets');
                                 }"
                            >
                                <d2-icon
                                    name="unlock-alt"
                                    class="d2-pr-10 d2-pl-10 dynamatic-opt-button"
                                ></d2-icon>
                            </span>
                        </span>
                        <div class="error-info">{{ item.errorInfo }}</div>
                    </div>
                </el-form-item>
                <el-form-item label="备注：" prop="describe">
                    <el-input
                        placeholder="请输入备注"
                        size="small"
                        v-model="form.describe"
                        style="width: 80%;"
                    ></el-input>
                </el-form-item>
                <el-form-item label="所属系统：" prop="belongSystem">
                    <el-select
                        size="small"
                        style="width: 80%;"
                        v-model="form.belongSystem"
                        filterable
                        allow-create
                        placeholder="请选择输入所属系统"
                    >
                        <el-option
                            v-for="item in systemList"
                            :key="item"
                            :label="item"
                            :value="item"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div style="text-align: center;" slot="footer">
            <el-button type="warning" size="small" @click="resetForm">重置</el-button>
            <el-button type="primary" size="small" @click="openCheckDialog">检查</el-button>
            <el-button
                type="success"
                size="small"
                @click="submitServer"
                :disabled="checkServerDisable"
            >提交</el-button>
        </div>
        <el-dialog
            title="服务检查"
            :visible.sync="checkServerDialogVisiable"
            append-to-body
            width="600px"
        >
            <p>
                <span>请选择在线检查协议：</span>
                <el-select v-model="protocolType" size="small">
                    <el-option
                        v-for="item in protocolList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    ></el-option>
                </el-select>

                <el-button
                    type="primary"
                    size="small"
                    class="d2-ml-10"
                    @click="getServerStatus"
                    :loading="checkButtonLoading"
                >检查</el-button>
            </p>
            <el-table :data="statusList">
                <el-table-column label="服务器IP" prop="server"></el-table-column>
                <el-table-column label="状态" prop="alive">
                    <template slot-scope="{ row }">
                        <template v-if="row.alive">
                            <d2-icon-svg name="dot" style="color: 67c23a;"></d2-icon-svg>
                            <span style="color: #67c23a;">成功</span>
                        </template>
                        <template v-else>
                            <d2-icon-svg name="dot" style="color: f56c6c;"></d2-icon-svg>
                            <span style="color: #f56c6c;">失败</span>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </el-dialog>
</template>

<script>
import {
    createDomain,
    checkServer,
    editDomain,
    pageQueryDomain,
    getMappingPort
} from '@/api/base-config';

import FormInfo from './FormInfo';

export default {
    name: 'BaseConfigDialog',
    components: {
        FormInfo
    },
    props: {
        saveForm: {
            // 保存菜单回调
            type: Function,
            required: true
        },
        value: Boolean,
        data: {
            type: [String, Array, Object]
        }
    },
    data() {
        return {
            form: {
                serviceName: '',
                domainName: [{
                    value: '',
                    errorInfo: ''
                }],
                isSsl: false,
                cer: '',
                key: '',
                // 域名
                listenPort: '',
                entryList: [
                    // 网站入口
                    {
                        value: '/',
                        errorInfo: '',
                        disabled: false
                    }
                ],
                targets: [
                    // 服务器IP
                    {
                        target: '',
                        weight: '',
                        errorInfo: '',
                        disabled: false
                    }
                ],
                http: true, // 是否http 向后兼容
                describe: '', // 域描述
                belongSystem: '' // 所属系统
            },
            checkServerDialogVisiable: false, // 服务检查弹窗
            checkServerDisable: false, // 提交按钮禁用， 当服务检查通过时启用
            modalTitle: '新增基础配置', // modal 标题
            statusList: [], // 检查结果
            protocolList: [
                // 检查协议
                {
                    value: 0,
                    label: 'TCP'
                },
                {
                    value: 1,
                    label: 'HTTP'
                }
            ],
            systemList: [],
            protocolType: 1, // 协议类型
            checkButtonLoading: false, // 检查按钮
            nginxPortList: [
                8080, 8090, 8100
            ]
        };
    },
    computed: {
        formVisible() {
            return this.value;
        },
        formType() {
            return this.data;
        }

    },
    watch: {
        // 'form.targets': {
        //     // 已废弃
        //     handler() {
        //         this.checkServerDisable = false;
        //     },
        //     deep: true
        // }
    },
    methods: {
        // 验证网站入口
        valiateEntry() {
            if (this.form.entryList.some(item => !item.value)) {
                this.form.entryList[0].errorInfo = '请至少填写一项';
                return false;
            }
            /* eslint-disable */
            // const regexp = /^(\/[a-z0-9-A-Z\_\-\.\*]+)+$/;
            const regexp = /./;
            const message = "正确格式为 /xxx..../xxx";
            return this.form.entryList.every((item, index) => {
                let result =
                    !item.value || regexp.test(item.value) ? "" : message;
                this.form.entryList[index].errorInfo = result;
                return !result;
            });
        },

        valiateDomain() {
            if (this.form.domainName.some(item => !item.value)) {
                this.form.domainName[0].errorInfo = '请至少填写一项';
                return false;
            }
            /* eslint-disable */
            // const regexp = /^(\/[a-z0-9-A-Z\_\-\.\*]+)+$/;
            const regexp = /\:/;
            const message = "正确格式为 abc.xxx:443";
            return this.form.domainName.every((item, index) => {
                let result =
                    !item.value || regexp.test(item.value) ? "" : message;
                this.form.domainName[index].errorInfo = result;
                return !result;
            });
        },

        // IP验证
        valiateIP() {
            if (this.form.targets.every(item => !item.target)) {
                this.form.targets[0].errorInfo = "请至少填写一项";
                return false;
            }
            const regexp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\-(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])))\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
            const numberRegexp = /(^\d{1,2}$)|(^100$)/;
            const message =
                "单独IP格式为 a.b.c.d:xxxx, 连续IP格式为a.b.c.xx-xx:xxxx";
            return this.form.targets.every((item, index) => {
                let result =
                    !item.target || regexp.test(item.target) ? "" : message;
                result =
                    result || (item.weight && numberRegexp.test(item.weight))
                        ? ""
                        : "权重范围0~100";

                this.form.targets[index].errorInfo = result;
                return !result;
            });
        },

        // 校验整个表单
        async validateForm() {
            return (
                (await this.$refs.form.validate()) &&
                this.valiateIP() &&
                this.valiateEntry()
            );
        },

        // 提交表单
        async submitServer() {
            let result = await this.validateForm();
            if (!result) {
                this.$message.error("请正确填写表单");
                return;
            }
            let formData = JSON.parse(JSON.stringify(this.form));
            formData.entryList = formData.entryList
                .map(item => item.value)
                .filter(item => item);
            formData.domainName = formData.domainName
                .map(item => item.value)
                .filter(item => item);

            formData.targets = formData.targets
                .map(item => item.target)
                .filter(item => item);

            formData.entryList = [...new Set(formData.entryList)];
            formData.targets = [...new Set(formData.targets)];
            formData.targets = formData.targets.map(item => {
                var targets = this.form.targets;
                for (var i = 0, len = targets.length; i < len; i++) {
                    if (targets[i].target === item) {
                        return `${item} weight=${targets[i].weight}`;
                    }
                }
                return item;
            });
            // formData.http = formData.http === "http://" ? true : false;
            if (this.data) {
                // 更新
                formData.domainId = this.data.domainId;
                editDomain(formData)
                    .then(res => {
                        this.saveForm(formData);
                        this.closeDialog();
                        this.$message.success("编辑成功");
                    })
                    .catch(res => {
                        this.$message.error("内部错误，错误代码【" + res.code + "】");
                    });
            } else {
                // 新建;
                createDomain(formData)
                    .then(res => {
                        this.saveForm(formData);
                        this.closeDialog();
                        this.$message.success("新建成功");
                    })
                    .catch(res => {
                        this.$message.error("内部错误，错误代码【" + res.code + "】");
                    });
            }
        },
        initForm() {
            this.queryBelongSystem();
            let value = this.data;
            this.modalTitle = value ? "编辑基础配置" : "新增基础配置";
            if (value) {
                // 编辑情况下填值
                this.form = {
                    domainName: value.domainName.map(item => {
                        return {
                            value: item,
                            errorInfo: "",
                            disabled: false
                        };
                    }),
                    entryList: value.entryList.map(item => {
                        return {
                            value: item,
                            errorInfo: "",
                            disabled: false
                        };
                    }),
                    targets: value.targets.map(item => {
                        // x.x.x.x:xx-xxx weight=xx
                        const array = item.split(" ");
                        return {
                            target: array[0],
                            weight:
                                (array[1] &&
                                    array[1].substr(
                                        array[1].lastIndexOf("=") + 1
                                    )) ||
                                "",
                            errorInfo: "",
                            disabled: false
                        };
                    }),
                    describe: value.describe,
                    belongSystem: value.belongSystem,
                    serviceName: value.serviceName,
                    listenPort: value.listenPort,
                    isSsl: value.isSsl,
                    cer: value.cer,
                    key: value.key
                };
                setTimeout(() => {
                    this.checkServerDisable = false;
                });
            }
        },
        // 重置表单
        resetForm() {
            this.$refs.form.resetFields();
            this.form = {
                domainName: [{ value: "", errorInfo: "" }],
                entryList: [{ value: "/", errorInfo: "" }],
                targets: [
                    {
                        target: "",
                        weight: "",
                        errorInfo: "",
                        disabled: false,
                    }
                ],
                note: "",
                listenPort: '',
                isSsl: false,
                cer: '',
                key: ''
            };
        },
        // 关闭弹窗
        closeDialog() {
            this.checkServerDisable = false;
            this.resetForm();
            this.$emit("input", false);
        },
        // 解锁单项表单
        unlockFormItem(index, prop) {
            this.$set(this.form[prop][index], "disabled", false);
        },
        // 获取服务器状态
        getServerStatus() {
            this.checkButtonLoading = true;
            checkServer(
                {
                    target: this.form.targets
                        .map(item => item.target)
                        .filter(item => item),
                    proto: Number(this.protocolType)
                },
                this.form.targets.length * 5 * 1000 // 动态超时时间
            )
                .then(res => {
                    this.statusList = res;
                    this.checkButtonLoading = false;
                    // this.checkServerDisable = res.some(item => !item.alive);
                    this.checkServerDisable = false;
                })
                .catch(res => {
                    this.checkButtonLoading = false;
                });
        },
        openCheckDialog() {
            if (this.valiateIP()) {
                this.checkServerDialogVisiable = true;
                this.statusList = [];
            }
        },
        queryBelongSystem() {
            // 加载所属系统
            pageQueryDomain({
                pageSize: 9999,
                pageIndex: 1
            }).then(data => {
                const { domains, ...pageData } = data;
                this.pageData = pageData;
                this.systemList = [
                    ...new Set(domains.map(item => item.belongSystem))
                ].filter(item => item);
                this.tableLoading = false;
            });
        },
        initMappingPort() {
            const type = this.form.isSsl ? 'https' : 'http'
            getMappingPort({
                type
            }).then(data => {
                this.nginxPortList = data.portList
            })
        },
        handleChangePortType() {
            this.initMappingPort()
            this.form.listenPort = ''
            this.$refs.form.clearValidate('listenPort')
        }
     },
    mounted() {
        this.initMappingPort()
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
.error-info {
    height: 12px;
    line-height: 12px;
    font-size: 12px;
    color: #f56c6c;
}
</style>

<style lang="less">
// 添加动态表单错误提示
.base-config-form {
    .error-input {
        .el-input__inner {
            border-color: #f56c6c;
        }
    }
}
</style>

