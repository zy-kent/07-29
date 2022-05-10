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
                        @click="openCreateTemplateDialog"
                    >规则新增</el-button>
                </div>
            </div>

            <el-table :data="tableList" @sort-change="sortChange">
                <el-table-column
                    prop="name"
                    label="规则编码"
                    :render-header="renderSearch('libraryIdPat')"
                >
                    <template slot-scope="{row}">
                        <span
                            @click="openInfoTemplateDialog(row)"
                            class="opt-a opt-a-item opt-a-item--last"
                        >{{row.libraryId }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="cname"
                    label="规则类别"
                    :render-header="renderSearch('filterNamePat')"
                ></el-table-column>
                <el-table-column prop="explain" label="规则类别描述"></el-table-column>
                <el-table-column prop="describe" label="规则描述"></el-table-column>
                <el-table-column prop="operator" label="操作人" :render-header="renderOperator"></el-table-column>

                <!-- <el-table-column prop="createTime" label="处置方式" :formatter="formatterTime"></el-table-column> -->
                <el-table-column prop="operateTime" label="操作时间" :formatter="formatterTime"></el-table-column>

                <!-- <el-table-column prop="type" label="是否私有"></el-table-column> -->
                <el-table-column prop="date" label="操作">
                    <template slot-scope="{row}">
                        <span
                            @click="openEditTemplateDialog(row)"
                            class="opt-a opt-a-item opt-a-item--first"
                        >编辑</span>
                        <span @click="openCopyTemplateDialog(row)" class="opt-a opt-a-item">复制</span>
                        <span
                            @click="deleteTemplate(row)"
                            class="opt-a opt-a-item opt-a-item--last"
                        >删除</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :data="pageData" :change="pageChange"></pagination>
            <form-dialog
                v-if="formConfig.formVisible"
                :data="currentRow"
                :config="formConfig"
                @save="queryList"
            />
            <!-- <el-dialog
                :title="dialogTitle"
                :visible.sync="formConfig.formVisible"
                append-to-body
                width="900px"
            >
                <form-dialog
                    v-if="formConfig.formVisible"
                    :data="currentRow"
                    :config="formConfig"
                    @cancel="formConfig.formVisible=false"
                    @save="()=>{formConfig.formVisible=false;queryList()}"
                />
            </el-dialog>-->
        </div>
    </d2-container>
</template>

<script>
import { pageQueryTemplate, removeConfig } from '@/api/rule-template';
import SearchHeader from '@/components/local/header/search';
import FormDialog from './components/FormDialog';
// import mutilLine from '@/components/local/mg-table-mutil-line';
import filterBoard from '@/components/local/filter-board';
import pagination from '@/components/local/pagination';
import Message from '@/libs/util.message';
import filterMixin from '@common/mixins/filter';
import dayjs from 'dayjs';

const propReflect = {
    libraryIdPat: {
        label: '规则编码',
        labelKey: 'libraryIdPat'
    },
    filterNamePat: {
        label: '规则类别',
        labelKey: 'filterNamePat'
    }
};

export default {
    name: 'Template-List',
    components: {
        // 'mg-table-mutil-line': mutilLine,
        filterBoard,
        pagination,
        'form-dialog': FormDialog
    },
    mixins: [filterMixin],
    data() {
        return {
            tableList: [],
            requestParams: {
                pageSize: 5,
                pageIndex: 1,
                namePat: ''
            },
            dataLoading: true,
            filename: __filename,
            filterItems: [],
            copyCreateDialogVisible: false,
            newRule: {
                name: ''
            },
            pageData: {
                currentPage: 1,
                total: 400
            },
            dialogTitle: '规则新增',
            currentRow: {},

            formConfig: {
                dialogTitle: '规则新增',
                formVisible: false,
                formType: 'create'
            }
        };
    },
    created() {
        this.queryList(1);
    },
    methods: {
        // 获取模版列表
        queryList(pageIndex) {
            if (pageIndex) {
                this.requestParams.pageIndex = pageIndex;
            }
            this.dataLoading = true;
            pageQueryTemplate(this.requestParams)
                .then(data => {
                    const { librarys, ...pageData } = data;
                    this.pageData = pageData;
                    this.tableList = librarys;
                    this.dataLoading = false;
                })
                .catch(res => {
                    this.dataLoading = false;
                });
        },

        renderOperator(h, { column, $index }) {
            let props = {
                label: '操作人',
                labelKey: 'operatorPat',
                handler: this.headerChange
            };
            return h(SearchHeader, { props });
        },

        // 删除模版弹窗提示
        deleteTemplate(row) {
            if (row.referred) {
                return this.$message.warning(
                    '当前规则已关联域，请先解除绑定关系'
                );
            }
            Message.deleteConfirm({
                content: '是否删除当前规则，请谨慎删除！'
            })
                .then(res => {
                    removeConfig({ libraryId: row.libraryId })
                        .then(res => {
                            this.$message.success('删除成功');
                            this.queryList();
                        })
                        .catch(res => {
                            this.$message.error('删除失败，当前规则已经关联');

                            this.queryList();
                        });
                })
                .catch(() => {});
        },
        // 渲染表头搜索类型
        renderSearch(prop) {
            let that = this;
            let props = {
                label: propReflect[prop].label,
                labelKey: propReflect[prop].labelKey,
                handler: that.headerChange
            };
            return function(h, { column, $index }) {
                return h(SearchHeader, { props });
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
            this.setFilterItems(data);
            this.requestParams[data.key] = data.value;
            this.queryList();
        },
        // 创建副本
        openCopyTemplateDialog(row) {
            this.currentRow = JSON.parse(JSON.stringify(row));
            this.formConfig = {
                formVisible: true,
                formType: 'copy',
                dialogTitle: '复制规则'
            };
        },
        // 编辑规则
        openEditTemplateDialog(row) {
            this.currentRow = JSON.parse(JSON.stringify(row));
            this.formConfig = {
                formVisible: true,
                formType: 'edit',
                dialogTitle: '编辑规则'
            };
        },
        // 创建规则
        openCreateTemplateDialog(row) {
            this.currentRow = undefined;
            this.formConfig = {
                formVisible: true,
                formType: 'create',
                dialogTitle: '新建规则'
            };
        },
        // 查看规则
        openInfoTemplateDialog(row) {
            this.currentRow = JSON.parse(JSON.stringify(row));
            this.formConfig.formVisible = true;
            this.formConfig.formType = 'preview';
            this.dialogTitle = '规则详情';
        },
        formatterTime(row, column, cellValue, index) {
            return dayjs(new Date(cellValue)).format('YYYY-MM-DD HH:mm:ss');
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

.mutil-line {
    padding: 0;
    margin: 0;
    line-height: 1.4;
}
</style>
