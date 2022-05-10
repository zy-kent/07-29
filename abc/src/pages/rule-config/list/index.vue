<!-- 域详细配置管理 -->
<template>
    <d2-container :filename="filename">
        <template slot="header">
            <mg-breadcrumb/>
        </template>
        <div class="page-container d2-clearfix">
            <div class="table-banner d2-clearfix">
                <filter-board
                    :filter-items="filterItems"
                    :remove-filter-label="removeListFilter"
                    style="line-height:18px;"
                ></filter-board>
                <div class="d2-fr">
                    <span style="padding: 0 12px; color: #409EFF;">
                        <i class="el-icon-loading" v-show="dataLoading"></i>
                    </span>
                    <el-button
                        icon="el-icon-plus"
                        type="primary"
                        size="mini"
                        @click="openDialog({}, 'create')"
                    >添加绑定关系</el-button>
                </div>
            </div>

            <el-table :data="tableList" @sort-change="sortChange">
                <el-table-column prop="serviceName" label="业务名称" :render-header="renderServiceName"></el-table-column>
                <el-table-column prop="ruleId" label="绑定关系编码" :render-header="renderRuleCode">
                    <template slot-scope="{row}">
                        <span class="opt-a" @click="openDialog(row, 'preview')">{{ row.groupId }}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    prop="subsidiary"
                    label="所属子公司"
                    :render-header="renderSelectHeader('subsidiary')"
                ></el-table-column>-->
                <!-- <el-table-column prop="subsidiary" label="所属子公司"></el-table-column> -->
                <el-table-column prop="domainName" label="网站域名" :render-header="renderDomain" :formatter="(row, column, cellValue, index)=>cellValue.join('，')"></el-table-column>
                <el-table-column
                    prop="entryList"
                    label="网站入口"
                    :render-header="renderEntry"
                    :formatter="(row, column, cellValue, index)=>cellValue.join('，')"
                ></el-table-column>
                <el-table-column prop="describe" label="绑定关系说明"></el-table-column>
                <el-table-column prop="libraryIdList" label="绑定规则编码">
                    <template slot-scope="{row}">
                        <span v-for="(code, index) in row.libraryIdList" :key="code">
                            <span class="opt-a" @click="openCodeDialog(code, 'preview')">{{ code }}</span>
                            <span v-if="index!==row.libraryIdList.length-1">，</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作人" :render-header="renderOperator"></el-table-column>
                <el-table-column prop="operateTime" label="操作时间" :formatter="formatterTime"></el-table-column>
                <!-- <el-table-column label="启用开关">
                    <template slot-scope="{row, $index}">
                        <el-switch
                            size="mini"
                            v-model="switchStatus[$index]"
                            active-color="#409EFF"
                            inactive-color="#ccc"
                            @change="switchRuleStatus(row)"
                        ></el-switch>
                    </template>
                </el-table-column>-->
                <el-table-column label="操作">
                    <template slot-scope="{$index, row}">
                        <el-switch
                            size="mini"
                            v-model="switchStatus[$index]"
                            active-color="#409EFF"
                            inactive-color="#ccc"
                            @change="switchRuleStatus($event,row)"
                        ></el-switch>
                        <span
                            class="opt-a opt-a-item opt-a-item--last"
                            @click="openDialog(row, 'edit')"
                        >编辑</span>
                        <span
                            class="opt-a opt-a-item opt-a-item--last"
                            @click="openDialog(row,'delete')"
                        >删除</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :data="pageData" :change="pageChange"></pagination>

            <local-config-form
                :config="formConfig"
                :data="currentRow"
                @save="queryList"
                v-if="formConfig.visible"
            />

            <form-dialog
                :data="currentRowCode"
                :config="formConfigCode"
                @save="queryList"
                v-if="formConfigCode.formVisible"
            />
        </div>
    </d2-container>
</template>

<script>
import { pageQueryTemplate } from '@/api/rule-template';

import { pageQueryRule, deleteBind, switchBind } from '@/api/rule-config';
import SearchHeader from '@/components/local/header/search';
import SelectHeader from '@/components/local/header/select';
// import MutilLine from '@/components/local/mg-table-mutil-line';
import filterBoard from '@/components/local/filter-board';
import pagination from '@/components/local/pagination';
import ConfigForm from './components/ConfigForm';
import FormDialog from '../../rule-template/list/components/FormDialog';

import Message from '@/libs/util.message';
import filterMixin from '@common/mixins/filter';
import dayjs from 'dayjs';

const headerReflect = {
    subsidiary: {
        list: [
            {
                label: '咪咕数媒',
                value: '咪咕数媒'
            }
        ],
        label: '所属子公司'
    },
    ruleType: {
        list: [
            {
                label: '白名单',
                value: '白名单'
            }
        ],
        label: '规则类型'
    },
    handleMethod: {
        list: [
            {
                label: '拦截',
                value: '拦截'
            },
            {
                label: '监控',
                value: '监控'
            }
        ],
        label: '处置方式'
    }
};

export default {
    name: 'rule-config-list',
    components: {
        // 'mg-table-mutil-line': MutilLine,
        'local-config-form': ConfigForm,
        FormDialog,
        filterBoard,
        pagination
    },
    mixins: [filterMixin],
    data() {
        return {
            tableList: [],
            currentRow: {},
            requestParams: {
                pageSize: 5,
                pageIndex: 1,
                entryPat: '',
                domainPat: ''
            },

            filename: __filename,
            filterItems: [],
            dataLoading: false,
            switchStatus: [],
            pageData: {
                currentPage: 1,
                total: 400
            },
            formConfig: {
                title: '添加绑定关系',
                type: 'create',
                visible: false
            },
            formConfigCode: {
                formVisible: false,
                formType: 'create'
            },
            currentRowCode: {}
        };
    },
    created() {
        this.queryList(1);
    },
    methods: {
        // 获取域名配置列表
        queryList(pageIndex) {
            this.switchStatus = [];
            if (pageIndex) {
                this.requestParams.pageIndex = pageIndex;
            }
            this.dataLoading = true;
            pageQueryRule(this.requestParams)
                .then(data => {
                    const { binds, ...pageData } = data;
                    this.pageData = pageData;
                    this.tableList = binds;
                    this.dataLoading = false;
                    this.switchStatus = binds.map(item => !!item.online);
                })
                .catch(res => {
                    this.dataLoading = false;
                });
        },

        // 删除规则说明
        deleteConfig(row) {
            Message.deleteConfirm({}).then(res => {
                // 重新请求列表
                deleteBind({
                    domainId: row.domainId,
                    groupId: row.groupId
                }).then(res => {
                    this.$message.success('删除成功');
                    this.queryList();
                });
            });
        },

        // 自定义域名表头
        renderDomain(h, { column, $index }) {
            let props = {
                label: '网站域名',
                labelKey: 'domainNamePat',
                handler: this.headerChange
            };
            return h(SearchHeader, { props });
        },
        // 自定义网站入口表头
        renderEntry(h, { column, $index }) {
            let props = {
                label: '网站入口',
                labelKey: 'entryPat',
                handler: this.headerChange
            };
            return h(SearchHeader, { props });
        },
        // 网站编码表头
        renderRuleCode(h, { column, $index }) {
            let props = {
                label: '绑定关系编码',
                labelKey: 'groupIdPat',
                handler: this.headerChange
            };
            return h(SearchHeader, { props });
        },
        renderServiceName(h, { column, $index }) {
            let props = {
                label: '业务名称',
                labelKey: 'serviceNamePat',
                handler: this.headerChange
            };
            return h(SearchHeader, { props });
        },
        // 网站编码表头
        renderOperator(h, { column, $index }) {
            let props = {
                label: '操作人',
                labelKey: 'operatorPat',
                handler: this.headerChange
            };
            return h(SearchHeader, { props });
        },
        // 渲染下拉选择框
        renderSelectHeader(prop) {
            let that = this;
            return function(h, { column, $index }) {
                let props = {
                    label: headerReflect[prop].label,
                    labelKey: prop,
                    handler: that.headerChange,
                    list: headerReflect[prop].list
                };
                return h(SelectHeader, { props });
            };
        },

        // 排序
        sortChange(item) {
            if (!item.order) {
                this.requestParams.sort_field_list = [];
                this.queryList(1);
                return;
            }
            this.requestParams.sort_field_list = [
                {
                    field: item.prop,
                    sort: item.order === 'ascending' ? 'asc' : 'desc'
                }
            ];
            this.queryList(1);
        },
        // 分页变化
        pageChange({ pageSize, pageIndex }) {
            pageSize && (this.requestParams.pageSize = pageSize);
            pageIndex && (this.requestParams.pageIndex = pageIndex);
            this.queryList();
        },
        // 响应表头筛选
        headerChange(data) {
            // debugger;
            this.setFilterItems(data);
            this.requestParams[data.key] = data.value;
            this.queryList(1);
        },
        // 切换规则状态
        switchRuleStatus(e, row) {
            // todo v3
            switchBind({
                online: e,
                groupId: row.groupId
            });
        },
        formatterTime(row, column, cellValue, index) {
            return dayjs(new Date(cellValue)).format('YYYY-MM-DD HH:mm:ss');
        },
        openDialog(row, type) {
            const title = {
                create: '添加绑定关系',
                edit: '修改绑定关系',
                preview: '预览'
            };
            if (type === 'preview' || type === 'edit') {
                let actionCfgMap = {};
                row.actBindList.forEach(item => {
                    actionCfgMap[item.libraryId] = {
                        ...item
                    };
                });
                this.formConfig = {
                    title: title[type],
                    type,
                    visible: true
                };
                this.currentRow = JSON.parse(
                    JSON.stringify({
                        ...row,
                        domain: {
                            domainId: row.domainId || '',
                            domainName: row.domainName || '',
                            entryList: row.entryList || [],
                            serviceName: row.serviceName || ''
                        },

                        actionCfgMap
                    })
                );
            } else if (type === 'create') {
                this.formConfig = {
                    title: title[type],
                    type,
                    visible: true
                };
                this.currentRow = JSON.parse(
                    JSON.stringify({
                        domain: {
                            domainId: row.domainId || '',
                            domainName: row.domainName || '',
                            entryList: row.entryList || [],
                            serviceName: row.serviceName || ''

                        },
                        actionCfgMap: {}
                    })
                );
            } else {
                // delete
                this.deleteConfig(row);
            }
        },
        async openCodeDialog(code) {
            this.currentRowCode = await pageQueryTemplate({
                libraryIdPat: code,
                pageIndex: 1,
                pageSize: 999
            }).then(res => {
                return res.librarys[0];
            });
            this.formConfigCode = {
                formVisible: true,
                formType: 'preview'
            };
        }
    }
};
</script>
<style lang="less" scoped>
.table-banner {
    // margin-left: -20px;
    // margin-right: -20px;
    // margin-top: -20px;
    padding: 10px 20px;
    padding-left: 0;
    background: white;
    border-bottom: 1px solid rgb(235, 245, 238);
}
.opt-a {
    color: rgba(40, 141, 245, 1);
    font-size: 12px;
    cursor: pointer;
}
.mutil-line {
    padding: 0;
    margin: 0;
    line-height: 1.4;
}
</style>
