<template>
    <d2-container :filename="filename">
        <template slot="header">
            <mg-breadcrumb />
        </template>
        <div class="page-container d2-clearfix report-slider">
            <div class="search-container">
                <h2 class="sql-title">输入相关查询语句(where语句之后)</h2>
                <sql-editor
                    :defaultSql="defaultSql"
                    :loading="loading"
                    @search="handleSearch">
                </sql-editor>
            </div>
            <el-container>
                <el-aside width="250px" style="padding-top: 20px;">
                    <div class="field-title">
                        <h2>字段编辑（{{selectedFieldList.length}}项）</h2>
                        <el-button type="primary" size="mini" @click="handleShowSelectedFieldDialog">筛选字段</el-button>
                    </div>
                    <el-collapse
                        v-model="currentField"
                        v-loading="loading"
                        element-loading-text="数据加载中..."
                        accordion
                        class="field-container"
                        @change="handleShowFieldDialog"
                    >
                        <el-collapse-item
                            v-for="item in fieldList"
                            :key="item.label"
                            :name="item.label"
                        >
                            <template slot="title">
                                <div class="label">{{item.label}}</div>
                                <div class="count">{{item.count | numberFormat}}</div>
                            </template>
                        </el-collapse-item>
                    </el-collapse>
                </el-aside>
                <el-container>
                    <el-main style="padding-right: 0;">
                        <el-table
                            stripe
                            :data="tableFieldData"
                            v-loading="tableLoading"
                            element-loading-text="数据加载中...">
                            <el-table-column
                                v-for="item in columns"
                                :key="item"
                                :prop="item"
                                :label="item"
                                min-width="150"
                                show-overflow-tooltip>
                            </el-table-column>
                        </el-table>
                        <div
                            v-show="tableFieldData.length > 0"
                            class="pagination-wrap">
                            <span>第 {{currentPage}} 页</span>
                            <el-pagination
                                class="fieldlist-pagination"
                                :current-page.sync="currentPage"
                                :page-size="pageSize"
                                :total="totalCount"
                                layout="prev, next"
                                @current-change="handleCurrentChange">
                            </el-pagination>
                        </div>
                    </el-main>
                </el-container>
            </el-container>
            <el-dialog
                class="field-dialog"
                :title="`${currentField}字段详情`"
                :visible.sync="dialogVisible"
                width="600px"
                @close="dialogCloseCallback">
                <el-table
                    border
                    v-loading="dialogTableLoading"
                    element-loading-text="数据加载中..."
                    :data="dialogTableData">
                    <el-table-column prop="fieldValue" label="字段值">
                    </el-table-column>
                    <el-table-column prop="count" label="数量">
                        <template slot-scope="scope">
                            {{scope.row.count | numberFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="percent" label="百分比">
                    </el-table-column>
                </el-table>
                <div
                    v-show="dialogTableData.length > 0"
                    class="pagination-wrap">
                    <span>第 {{dialogCurrentPage}} 页</span>
                    <el-pagination
                        class="fieldlist-pagination"
                        :current-page.sync="dialogCurrentPage"
                        :page-size="dialogPageSize"
                        :total="dialogTotalCount"
                        layout="prev, next"
                        @current-change="handleDialogCurrentChange">
                    </el-pagination>
                </div>
            </el-dialog>
            <el-dialog
                class="field-dialog"
                :title="`筛选字段（已选 ${selectedFieldList.length} 项）`"
                :visible.sync="selectFieldDialogVisible"
                width="400px"
                @close="selectFieldDialogCloseCallback">
                <el-table
                    ref="selectedFieldTable"
                    stripe
                    height="400"
                    :data="allFieldList"
                    @selection-change="handleSelectFieldChange">
                    <el-table-column prop="label" label="字段">
                    </el-table-column>
                    <el-table-column type="selection" label="选择"></el-table-column>
                </el-table>
                <div
                    slot="footer"
                    class="dialog-footer">
                    <el-button @click="selectFieldDialogVisible = false">
                        取消
                    </el-button>
                    <el-button
                        type="primary"
                        :loading="loading"
                        @click="handleConfirmSelect">
                        确定
                    </el-button>
                </div>
            </el-dialog>
        </div>
    </d2-container>
</template>

<script>
import SqlEditor from './components/SqlEditor'
import { columnData, getBusinessFieldData, getBusinessFieldDetail, getBusinessFieldGroup } from '@/api/logger'
import util from '@/libs/util'

export default {
    name: 'LoggerBusiness',
    components: {
        SqlEditor
    },
    mixins: [],
    data() {
        const defaultSql = `accessTime='${util.date.formatDate(new Date().getTime(), 'yyyy-MM-dd')}'`
        return {
            filename: __filename,
            defaultSql,
            loading: false,
            tableLoading: false,
            dialogTableLoading: false,
            query: defaultSql,
            searchKey: '',
            inputWordsArr: [],
            fieldList: [],
            selectedFieldList: [],
            backupSelectedFieldList: [],
            currentField: '',
            dialogVisible: false,
            dialogTableData: [],
            dialogCurrentPage: 1,
            dialogPageSize: 10,
            dialogTotalCount: 0,
            columns: [],
            tableFieldData: [],
            currentPage: 1,
            pageSize: 10,
            totalCount: 0,
            selectFieldDialogVisible: false
        }
    },
    computed: {
        finalSearchKey() {
            return this.inputWordsArr.join(' ')
        },
        allFieldList() {
            return columnData.all.map(item => ({ label: item }))
        },
        defaultFieldList() {
            return columnData.default.map(item => ({ label: item }))
        }
    },
    mounted() {
        this.initFieldList()
        this.renderBusinessField()
    },
    watch: {
    },
    methods: {
        querySearch(queryString, cb) {
            var defaultWordsList = JSON.parse(JSON.stringify(this.wordsList));
            var results = queryString ? defaultWordsList.filter(this.createFilter(queryString)) : defaultWordsList;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (word) => {
                return (word.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        handleSelect(item) {
            this.inputWordsArr.push(item.value)
            this.searchKey = ''
        },
        handleInputKeyUp(e) {
            const keyCode = window.event ? e.keyCode : e.which
            if (keyCode === 13 /* 回车键 */ && this.searchKey !== '') {
                this.inputWordsArr.push(this.searchKey)
                this.searchKey = ''
            } else if (keyCode === 8 /* 删除键 */ && this.searchKey === '') {
                const word = this.inputWordsArr.pop()
                this.searchKey = word
            } else if (keyCode === 32 /* 空格键 */ && this.searchKey !== '') {
                this.inputWordsArr.push(this.searchKey)
                this.searchKey = ''
            }
        },
        handleSearch(sql) {
            this.query = sql
            this.currentPage = 1
            this.tableLoading = true
            this.renderBusinessField()
        },
        initFieldList() {
            this.fieldList = this.defaultFieldList.map(item => {
                const newItem = {
                    label: item.label,
                    count: 0
                }
                return newItem
            })
            this.selectedFieldList = [...this.defaultFieldList]
        },
        handleShowFieldDialog() {
            this.dialogVisible = true
            this.dialogCurrentPage = 1
            this.renderBusinessFieldGroup()
        },
        dialogCloseCallback() {
            this.dialogTableData = []
            this.currentField = ''
        },
        handleDialogCurrentChange() {
            this.renderBusinessFieldGroup()
        },
        handleCurrentChange() {
            this.tableLoading = true
            this.renderBusinessFieldDetail()
        },
        initSelectedFieldDialog() {
            this.$nextTick(() => {
                this.$refs.selectedFieldTable.clearSelection()
                this.allFieldList.forEach(item => {
                    let isSelected = this.selectedFieldList.find(selectedItem => {
                        return selectedItem.label === item.label
                    })
                    if (isSelected) {
                        this.$refs.selectedFieldTable.toggleRowSelection(item, true)
                    }
                })
            })
        },
        selectFieldDialogCloseCallback() {
            this.selectedFieldList = [...this.backupSelectedFieldList]
            this.backupSelectedFieldList = []
        },
        handleShowSelectedFieldDialog() {
            this.selectFieldDialogVisible = true
            this.backupSelectedFieldList = [...this.selectedFieldList]
            this.initSelectedFieldDialog()
        },
        handleSelectFieldChange(val) {
            // console.log(val)
            this.$nextTick(() => {
                this.selectedFieldList = val
            })
        },
        handleConfirmSelect() {
            const max = 20
            if (this.selectedFieldList.length > max) {
                this.$message({
                    message: `选择的字段数量不能超过${max}`,
                    type: 'warning'
                });
                return false
            } else {
                this.backupSelectedFieldList = [...this.selectedFieldList]
                this.fieldList = this.selectedFieldList.map(item => {
                    const newItem = {
                        label: item.label,
                        count: 0
                    }
                    return newItem
                })
                this.selectFieldDialogVisible = false
                this.currentPage = 1
                this.tableLoading = true
                this.renderBusinessField()
            }
        },
        renderBusinessField() {
            this.loading = true
            const params = {
                query: this.query,
                columns: this.selectedFieldList.map(item => item.label)
            }
            getBusinessFieldData(params).then(res => {
                const { columns } = res
                this.fieldList.forEach(item => {
                    const columnsItem = columns.find(resItem => resItem.name === item.label)
                    item.count = columnsItem ? columnsItem.value : 0
                })
                this.loading = false
                this.renderBusinessFieldDetail()
            }).catch(error => {
                this.loading = false
                if (error.code === -2) {
                    const msgObj = JSON.parse(error.msg)
                    const msg = Object.values(msgObj).join(', ')
                    this.$message.error(`校验问题：${msg}`)
                } else {
                    this.$message.error(error.msg)
                }
            })
        },
        renderBusinessFieldDetail() {
            this.tableLoading = true
            const params = {
                query: this.query,
                columns: this.selectedFieldList.map(item => item.label),
                pageIndex: this.currentPage,
                pageSize: this.pageSize
            }
            getBusinessFieldDetail(params).then(res => {
                this.tableLoading = false
                this.totalCount = res.totalCount
                this.columns = res.columns
                this.tableFieldData = res.series.map(item => {
                    const obj = {}
                    item.data.forEach((dataItem, dataIndex) => {
                        obj[this.columns[dataIndex]] = dataItem
                    })
                    return obj
                })
            }).catch(error => {
                this.tableLoading = false
                this.$message.error(error.msg)
            })
        },
        renderBusinessFieldGroup() {
            this.dialogTableLoading = true
            const params = {
                query: this.query,
                queryColumn: this.currentField,
                pageIndex: this.dialogCurrentPage,
                pageSize: this.dialogPageSize
            }
            const columns = ['fieldValue', 'count', 'percent']
            getBusinessFieldGroup(params).then(res => {
                this.dialogTableLoading = false
                this.dialogTotalCount = (this.dialogCurrentPage + (res.hasNextPage ? 1 : 0)) * this.dialogPageSize
                this.dialogTableData = res.series.map(item => {
                    const obj = {}
                    item.data.forEach((dataItem, dataIndex) => {
                        obj[columns[dataIndex]] = dataItem
                    })
                    return obj
                })
            }).catch(error => {
                this.dialogTableLoading = false
                this.$message.error(error.msg)
            })
        }
    },
    filters: {
        numberFormat(num) {
            return util.number.format(num)
        }
    }
};
</script>
<style lang="less" scoped>
.page-container {
    background: none;
    border: none;
}
.search-container {
    .sql-title {
        margin: 0 0 10px 0;
        padding: 0;
        font-size: 14px;
        font-weight: normal;
        border-left: 2px solid #288df5;
        padding-left: 10px;
    }
}
.field-container {
    .label {
        display: inline-block;
        width: 50%;
        font-size: 14px;
        padding-left: 15px;
    }
    .count {
        display: inline-block;
        width: 35%;
    }
    /deep/ .el-collapse-item__content {
        padding-bottom: 0;
        .field-item-detail {
            max-height: 400px;
            /deep/ .el-table th {
                background: #eeeeee;
            }
            /deep/ .el-table tr {
                background: #eee1e1;
            }
        }
    }
}
.field-dialog {
    /deep/ .el-dialog {
        overflow: hidden;
        .el-dialog__body {
            margin-bottom: 10px;
        }
    }
}
.pagination-wrap {
    margin-top: 10px;
    span {
        display: inline-block;
        font-size: 12px;
        line-height: 32px;
        vertical-align: middle;
        margin-right: 10px;
    }
    .el-pagination {
        display: inline-block;
        vertical-align: middle;
        /deep/ &.fieldlist-pagination {
            .btn-prev, .btn-next {
                background: none;
            }
        }
    }
}
.field-title {
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
    overflow: hidden;
    h2 {
        float: left;
        font-size: 14px;
        font-weight: normal;
        height: 20px;
        line-height: 20px;
        margin: 5px 0;
        border-left: 2px solid #288df5;
        padding-left: 10px;
    }
    button {
        float: right;
    }
}
</style>
