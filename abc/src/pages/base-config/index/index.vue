<template>
    <d2-container :filename="filename">
        <template slot="header">
            <mg-breadcrumb />
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
                        <i class="el-icon-loading" v-show="tableLoading"></i>
                    </span>

                    <el-button
                        icon="el-icon-plus"
                        type="primary"
                        size="mini"
                        @click="()=>{curRowData='';formVisible=true}"
                    >新建配置</el-button>
                    <!-- <a
                        :href="exportUrl"
                        target="_blank"
                        class="el-button el-button--default el-button--mini"
                    >
                        <i class="el-icon-download"></i>
                        <span>导出列表</span>
                    </a>-->
                </div>
            </div>

            <el-table :data="tableList" @sort-change="sortChange">
                <el-table-column prop="serviceName" label="业务名称" :render-header="renderServiceName"></el-table-column>

                <el-table-column prop="domainName" label="网站域名" :render-header="renderDomain">
                    <template slot-scope="{row}">
                        <mg-table-mutil-line :data="row.domainName">
                            <!-- 自定义每行的渲染模式 -->
                            <template slot-scope="{data}">
                                <p class="mutil-line">{{ data }}</p>
                            </template>
                        </mg-table-mutil-line>
                    </template>
                </el-table-column>

                <el-table-column prop="listenPort" label="nginx端口"></el-table-column>

                <el-table-column prop="entryList" label="网站入口" :render-header="renderEntry">
                    <template slot-scope="{row}">
                        <mg-table-mutil-line :data="row.entryList">
                            <!-- 自定义每行的渲染模式 -->
                            <template slot-scope="{data}">
                                <p class="mutil-line">{{ data }}</p>
                            </template>
                        </mg-table-mutil-line>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="targets"
                    label="服务器IP"
                    :render-header="renderTarget"
                    min-width="200px"
                >
                    <template slot-scope="{row}">
                        <mg-table-mutil-line :data="row.targets">
                            <!-- 自定义每行的渲染模式 -->
                            <template slot-scope="{data}">
                                <p class="mutil-line">{{ data }}</p>
                            </template>
                        </mg-table-mutil-line>
                    </template>
                </el-table-column>
                <el-table-column prop="describe" label="备注"></el-table-column>
                <el-table-column prop="belongSystem" label="所属系统"></el-table-column>

                <el-table-column prop="date" label="操作">
                    <template slot-scope="{row}">
                        <span @click="openEditDialog(row)" class="opt-a">编辑</span>
                        <span style="color: rgba(216, 216, 216, 1); padding: 0 6px;">|</span>
                        <span @click="deleteDomain(row)" class="opt-a">删除</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :data="pageData" :change="pageChange"></pagination>
            <base-config-dialog v-model="formVisible" :saveForm="onSaveForm" :data="curRowData" />
        </div>
    </d2-container>
</template>

<script>
import { pageQueryDomain, removeDomain } from '@/api/base-config';
import BaseConfigDialog from './components/BaseConfigDialog';
import SearchHeader from '@/components/local/header/search';
import MgTableMutilLine from '@/components/local/mg-table-mutil-line';
import FilterBoard from '@/components/local/filter-board';
import pagination from '@/components/local/pagination';
import MessageUtil from '@/libs/util.message';
import filterMixin from '@common/mixins/filter';

export default {
    name: 'BaseConfigList',
    components: {
        BaseConfigDialog,
        MgTableMutilLine,
        FilterBoard,
        pagination
    },
    mixins: [filterMixin],
    data() {
        return {
            tableList: [],
            formVisible: false,
            requestParams: {
                pageSize: 5,
                pageIndex: 1,
                entryPat: '',
                domainPat: ''
            },
            tableLoading: true,
            curRowData: '', // 当前选中行
            filename: __filename,
            filterItems: [], // 筛选元数组
            pageData: {
                currentPage: 1,
                total: 400
            }
            // exportUrl: ''  // 暂时不用
        };
    },
    created() {
        this.queryList(1); // 初始化查询
    },
    methods: {
        // 获取域名配置列表
        queryList(pageIndex) {
            if (pageIndex) {
                this.requestParams.pageIndex = pageIndex;
            }
            this.tableLoading = true;
            pageQueryDomain(this.requestParams)
                .then(data => {
                    const { domains, ...pageData } = data;
                    this.pageData = pageData;
                    this.tableList = domains;
                    this.tableLoading = false;
                })
                .catch(res => {
                    this.tableLoading = false;
                });
        },

        // 打开编辑弹窗
        openEditDialog(row) {
            this.curRowData = row;
            this.formVisible = true;
        },
        // 删除域名弹窗提示
        deleteDomain(row) {
            MessageUtil.deleteConfirm({})
                .then(res => {
                    removeDomain({ domainId: row.domainId })
                        .then(res => {
                            this.$message.success('删除成功');
                            this.queryList();
                        })
                        .catch(res => {
                            if (res.code === -3) {
                                this.$message.error(
                                    '当前配置已经和规则关联，请先解除规则配置关联后重试'
                                );
                            } else {
                                this.$message.error('删除失败');
                            }

                            this.queryList();
                        });
                })
                .catch(() => {
                    // 取消删除
                });
        },

        // 自定义域名表头
        renderDomain(h, { column, $index }) {
            let props = {
                label: '网站域名',
                labelKey: 'domainPat',
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
        renderServiceName(h, { column, $index }) {
            let props = {
                label: '业务名称',
                labelKey: 'serviceNamePat',
                handler: this.headerChange
            };
            return h(SearchHeader, { props });
        },
        // 自定义服务器IP
        renderTarget(h, { column, $index }) {
            let props = {
                label: '服务器IP',
                labelKey: 'targetPat',
                handler: this.headerChange
            };
            return h(SearchHeader, { props });
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
            this.setFilterItems(data);
            this.requestParams[data.key] = data.value;
            this.queryList();
        },
        // 响应事件
        onSaveForm() {
            this.queryList();
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
