<template>
    <el-dialog title="规则详情" :visible.sync="config.visible" append-to-body width="900px">
        <div slot="title">{{ config.title }}</div>
        <el-form :disabled="config.type==='preview'" class="config-domain">
            <domain-entry-select :domain="data.domain" :type="config.type" />
            <el-form-item label="绑定关系说明：" label-width="90px" style="margin-top: 12px; width: 84%;">
                <el-input type="textarea" placeholder="请输入描述" v-model="data.describe"></el-input>
            </el-form-item>

            <div class="d2-mt-10 d2-mb-10">
                <p class="d2-ml-10">
                    绑定规则：
                    <span
                        class="opt-a"
                        @click="selectVisible=true"
                        v-if="config.type!=='preview'"
                    >选择规则</span>
                </p>
            </div>
            <template v-if="Object.keys(data.actionCfgMap).length > 0">
                <el-collapse v-model="activeNames">
                    <el-collapse-item
                        v-for="(actionConfig, index) in data.actionCfgMap"
                        :key="actionConfig.libraryId"
                        :name="index"
                    >
                        <template slot="title">
                            <el-row
                                :gutter="24"
                                style="width: 820px; margin: 0; display: inline-block;"
                            >
                                <el-col :span="8">
                                    <span class="title">规则类别：</span>
                                    {{ actionConfig.filterCName }}
                                </el-col>
                                <el-col
                                    v-if="actionList[actionConfig.filterName].length > 0"
                                    :span="14"
                                >
                                    <span class="title">处置方式：</span>
                                    <el-select
                                        v-model="actionConfig.actionName"
                                        @blur="activeNames=index"
                                        size="mini"
                                    >
                                        <el-option
                                            v-for="action in actionList[actionConfig.filterName]"
                                            :key="action.actionName"
                                            :value="action.actionName"
                                            :label="action.cname"
                                        ></el-option>
                                    </el-select>
                                </el-col>
                                <el-col v-else :span="14">&nbsp;</el-col>
                                <el-col :span="2">
                                    <span
                                        @click="()=> { delete data.actionCfgMap[index]}"
                                        v-if="config.type!=='preview'"
                                    >
                                        <d2-icon
                                            class="d2-pr-10 d2-pl-10 dynamatic-opt-button"
                                            name="remove"
                                        />
                                    </span>
                                </el-col>
                            </el-row>
                        </template>
                        <config-handle :config="actionConfig"></config-handle>
                    </el-collapse-item>
                </el-collapse>
            </template>
            <div v-else style="text-indent: 7em; color: #ccc; font-size: 12px;">暂无规则，请选择</div>
            <el-dialog
                :visible.sync="selectVisible"
                append-to-body
                title="规则选择"
                width="1200px"
                @open="queryTemplate(1)"
            >
                <div>
                    <el-form inline :model="requestParams">
                        <el-form-item label="规则编码：">
                            <el-input
                                placeholder="输入规则编码"
                                style="width: auto"
                                clearable
                                v-model.lazy="requestParams.libraryIdPat"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="规则类别：">
                            <el-select
                                v-model.lazy="requestParams.filterNamePat"
                                clearable
                                filterable
                            >
                                <el-option
                                    v-for="type in allConfigTypeList"
                                    :key="type.filterName"
                                    :label="type.cname || type.filterName"
                                    :value="type.cname"
                                ></el-option>
                            </el-select>

                            <!-- <el-input
                                placeholder="输入规则类别"
                                style="width: auto"
                                clearable
                                v-model.lazy="requestParams.filterNamePat"
                            ></el-input>-->
                        </el-form-item>
                        <el-form-item label="规则描述：">
                            <el-input
                                placeholder="输入规则规则描述"
                                style="width: auto"
                                clearable
                                v-model.lazy="requestParams.describePat"
                            ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                @click="queryTemplate(1)"
                                icon="el-icon-search"
                                type="primary"
                                size="small"
                                round
                            ></el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <el-table
                    :data="tableList"
                    v-loading="loading"
                    row-key="libraryId"
                    @selection-change="selectChange"
                    ref="libraryTable"
                >
                    <el-table-column type="selection" label="规则编码"></el-table-column>
                    <el-table-column prop="libraryId" label="规则编码"></el-table-column>
                    <el-table-column prop="cname" label="规则类别"></el-table-column>
                    <el-table-column prop="describe" label="描述"></el-table-column>
                </el-table>
                <div class="d2-clearfix d2-mt-10 d2-pb-10">
                    <el-button @click="select" size="mini" type="primary">选择</el-button>
                    <el-button @click="selectVisible=false" size="mini" type="default">关闭</el-button>

                    <el-pagination
                        small
                        layout="prev, pager, next"
                        :total="pageData.total"
                        class="d2-fr"
                        :page-size="5"
                        @current-change="pageChange"
                    ></el-pagination>
                </div>
            </el-dialog>
        </el-form>
        <div style="text-align: center;" slot="footer">
            <!-- <el-button type="warning" size="small" @click="reset">重置</el-button> -->
            <el-button type="default" size="small" @click="config.visible=false">关闭</el-button>
            <el-button type="primary" size="small" @click="create" v-if="config.type==='create'">新建</el-button>
            <el-button type="primary" size="small" @click="update" v-if="config.type==='edit'">修改</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { queryActionList, createBind, updateBind } from '@api/rule-config';
import { pageQueryTemplate, queryConfigField } from '@/api/rule-template';

import DomainEntrySelect from './DomainEntrySelect';
import ConfigHandle from './ConfigHandle';
import { Promise } from 'q';
export default {
    props: {
        config: Object,
        data: Object
    },
    components: {
        'domain-entry-select': DomainEntrySelect,
        'config-handle': ConfigHandle
    },
    data() {
        return {
            searchParams: {},
            selectedConfig: [],
            pageData: {
                total: 50
            },
            requestParams: {
                pageSize: 5,
                pageIndex: 1,
                describePat: '',
                filterNamePat: '',
                libraryIdPat: ''
            },
            loading: false,
            tableList: [],
            selectVisible: false,
            currentRow: {},
            allConfigTypeList: [], // 规则类别
            selection: [],
            activeNames: '',
            actionList: {
                // 保存处置方式
            }
        };
    },
    methods: {
        pageChange(currentPage) {
            this.requestParams.pageIndex = currentPage;
            this.queryTemplate();
        },

        queryTemplate(pageIndex) {
            this.loading = true;
            if (pageIndex) {
                this.requestParams.pageIndex = pageIndex;
            }
            pageQueryTemplate(this.requestParams)
                .then(res => {
                    const { librarys, ...pageData } = res;
                    this.pageData = JSON.parse(JSON.stringify(pageData));
                    this.tableList = librarys;
                    this.loading = false;

                    // 设置勾选
                    this.$nextTick(() => {
                        this.tableList
                            .filter(item => {
                                return !!this.data.actionCfgMap[item.libraryId];
                            })
                            .map(row => {
                                this.$refs.libraryTable.toggleRowSelection(row);
                            });
                    });
                })
                .catch(err => {
                    console.log(err);
                    this.loading = false;
                });
        },

        select() {
            if (this.selection.length === 0) {
                return this.$message.warning('请至少选择一项规则');
            }
            this.selection.forEach(item => {
                if (this.actionList[item.filterName] === undefined) {
                    this.actionList[item.filterName] = false;
                }
            });
            // 查询
            this.queryActionList().then(res => {
                this.selection.forEach(item => {
                    if (!this.data.actionCfgMap[item.libraryId]) {
                        this.$set(this.data.actionCfgMap, item.libraryId, {
                            libraryId: item.libraryId,
                            filterCName: item.cname,
                            filterName: item.filterName,
                            actionName:
                                this.actionList[item.filterName][0] &&
                                this.actionList[item.filterName][0].actionName,
                            data: []
                        });
                    }
                });
            });

            this.selectVisible = false;
        },
        selectChange(selection) {
            this.selection = selection;
        },
        // 获取可配置的字段信息
        queryConfigField() {
            queryConfigField()
                .then(res => {
                    this.allConfigTypeList = res;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        queryActionList() {
            const taskList = [];
            for (const key in this.actionList) {
                if (this.actionList[key] === false) {
                    taskList.push(
                        queryActionList(key).then(res => {
                            this.$set(this.actionList, key, res);
                        })
                    );
                }
            }
            return Promise.all(taskList).then(() => {
                this.$forceUpdate();
            });
        },
        create() {
            let actions = JSON.parse(JSON.stringify(this.data.actionCfgMap));
            // for (let key in actions) {
            //     if (!actions[key].actionName) {
            //         delete actions[key];
            //     }
            // }
            if (this.data.domain.entryList.length === 0) {
                return this.$message.warning('请至少选择一个网站入口');
            }
            createBind({
                ...this.data.domain,
                actionCfgMap: actions,
                libraryIdList: Object.keys(actions),
                describe: this.data.describe
            })
                .then(res => {
                    this.config.visible = false;
                    this.$emit('save');
                })
                .catch(res => {
                    if (res.code === -4) {
                        this.$message.warning(
                            `当前入口 ${res.data[0][0]} 已配置`
                        );
                    } else {
                        this.$message.error('失败');
                    }
                });
        },
        update() {
            let actions = JSON.parse(JSON.stringify(this.data.actionCfgMap));
            // for (let key in actions) {
            //     if (!actions[key].actionName) {
            //         delete actions[key];
            //     }
            // }
            updateBind({
                describe: this.data.describe,
                ...this.data.domain,
                actionCfgMap: actions,
                libraryIdList: Object.keys(actions),
                groupId: this.data.groupId
            })
                .then(res => {
                    this.config.visible = false;
                    this.$emit('save');
                })
                .catch(res => {
                    if (res.code === -4) {
                        this.$message.warning(`当前入口 ${res.data} 已配置`);
                    } else {
                        this.$message.error('失败');
                    }
                });
        },
        reset() {}
    },
    created() {
        // 查询规则类别编码
        this.queryConfigField();
        // 查询默认参数
        for (let key in this.data.actionCfgMap) {
            this.actionList[this.data.actionCfgMap[key].filterName] = false;
        }
        this.queryActionList();
    }
};
</script>

<style lang="less" scoped>
.search-banner {
    margin-left: -20px;
    margin-right: -20px;
    border-top: 2px solid rgb(235, 245, 238);
    padding: 0 22px;
    padding-top: 12px;
    font-weight: bolder;
}
.title {
    font-weight: bold;
}
</style>

<style lang="less" >
.config-domain {
    .el-collapse-item {
        &.is-active {
            border-left: 1px solid #f6f7fb;
            border-right: 1px solid #f6f7fb;
            background: #f6f7fb;
        }
    }
    .el-collapse-item__header.is-active {
        background: #f6f7fb;
    }
    .el-collapse-item__header {
        padding-left: 10px;
    }
}
</style>
