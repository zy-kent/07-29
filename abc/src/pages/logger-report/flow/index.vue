<template>
    <d2-container :filename="filename">
        <template slot="header">
            <mg-breadcrumb />
        </template>
        <div class="page-container d2-clearfix report-slider">
            <div class="section-container">
                <el-form
                    ref="formFilter"
                    :inline="true"
                    :model="barFilter"
                    class="filter-container"
                    size="small"
                    @submit.native.prevent>
                    <el-form-item
                        label="查询时间">
                        <el-date-picker
                            v-model="barFilter.date"
                            size="medium"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :editable="false"
                            :clearable="false"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptionsDay"
                            @change="handleBarDateChange"
                        ></el-date-picker>
                    </el-form-item>
                </el-form>
                <bar-modal :chartData="barData" v-loading="barLoading" element-loading-text="数据加载中..."></bar-modal>
            </div>
            <div class="section-container">
                <el-form
                    ref="formFilter"
                    :inline="true"
                    :model="lineFilter"
                    class="filter-container"
                    size="small"
                    @submit.native.prevent>
                    <el-form-item
                        label="查询日期">
                        <el-date-picker
                            v-model="lineFilter.queryDate"
                            size="medium"
                            type="date"
                            placeholder="选择日期"
                            :editable="false"
                            :clearable="false"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptionsDay"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item
                        label="查询粒度">
                        <el-radio-group v-model="lineFilter.type">
                            <el-radio-button label="hour">小时</el-radio-button>
                            <el-radio-button label="minute">分钟</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item
                        label="域">
                        <el-select
                            v-model="lineFilter.domain"
                            placeholder="请选择域名"
                            style="width: 150px;"
                            clearable
                            @change="handleDomainChange">
                            <el-option
                                v-for="item in domainList"
                                :key="item.name"
                                :label="item.name"
                                :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="入口">
                        <el-select
                            v-model="lineFilter.entry"
                            placeholder="请选择入口"
                            style="width: 150px;"
                            clearable>
                            <el-option
                                v-for="item in entryList"
                                :key="item"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :loading="lineLoading" @click="handleLineDateSearch">查询</el-button>
                    </el-form-item>
                </el-form>
                <line-modal :chartData="lineData" :type="lineFilter.type" v-loading="lineLoading" element-loading-text="数据加载中..."></line-modal>
            </div>
            <div class="section-container">
                <h2>访问量Top10的IP</h2>
                <el-form
                    ref="formFilter"
                    :inline="true"
                    :model="tableFilter"
                    class="filter-container"
                    size="small"
                    @submit.native.prevent>
                    <el-form-item
                        label="激增时段">
                        <el-time-select
                            placeholder="起始时间"
                            v-model="tableFilter.fromTime"
                            :picker-options="{
                                start: '00:00',
                                step: '00:05',
                                end: '23:55'
                            }"
                            style="width: 130px; margin-right: 10px;">
                        </el-time-select>
                        <el-time-select
                            placeholder="结束时间"
                            v-model="tableFilter.toTime"
                            :picker-options="{
                                start: '00:00',
                                step: '00:05',
                                end: '23:55',
                                minTime: tableFilter.fromTime
                            }"
                            style="width: 130px;">
                        </el-time-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :loading="tableLoading" @click="handleTableDataSearch">查询</el-button>
                    </el-form-item>
                </el-form>
                <el-table
                    :data="tableData"
                    v-loading="tableLoading"
                    element-loading-text="数据加载中..."
                    stripe>
                    <el-table-column width="5"></el-table-column>
                    <el-table-column prop="section" label="时段">
                    </el-table-column>
                    <el-table-column prop="reqIp" label="访问ip">
                    </el-table-column>
                    <el-table-column prop="reqTotal" label="访问量">
                        <template slot-scope="scope">
                            {{scope.row.reqTotal | numberFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="hitRules" label="触碰规则量">
                        <template slot-scope="scope">
                            {{scope.row.hitRules | numberFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="105">
                        <template slot-scope="scope">
                            <a class="handle-btn" @click="handleShowDetail(scope.row)">查看详情</a>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog
            :title="`IP详情（${currentIP}）`"
            :visible.sync="dialogVisible"
            width="1000px"
            @close="dialogCloseCallback">
            <el-table
                :data="tableDetailData"
                v-loading="dialogTableLoading"
                element-loading-text="数据加载中..."
                stripe>
                <el-table-column width="5"></el-table-column>
                <el-table-column prop="reqIp" label="ip" width="140">
                </el-table-column>
                <el-table-column prop="host" label="host">
                </el-table-column>
                <el-table-column prop="path" label="path">
                </el-table-column>
                <el-table-column prop="userAgent" label="userAgent" width="120">
                </el-table-column>
                <el-table-column prop="canvasId" label="canvasId" width="100">
                </el-table-column>
                <el-table-column prop="accessDate" label="accessTime" width="180">
                </el-table-column>
            </el-table>
            <div
                v-show="tableDetailData.length > 0"
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
    </d2-container>
</template>

<script>
import BarModal from './components/BarModal'
import LineModal from './components/LineModal'
import util from '@/libs/util';
import { getFlowAnalysisDate, getFlowAnalysisHours, getFlowAnalysisMinute, getFlowAnalysisMinuteDetail } from '@/api/logger'

export default {
    name: 'LoggerFlow',
    components: {
        BarModal,
        LineModal
    },
    mixins: [],
    data() {
        return {
            filename: __filename,
            pickerOptionsDay: {
                disabledDate(time) {
                    // 2017/01/01 —— 今天
                    return time.getTime() > new Date().getTime() || time.getTime() < new Date('2017/01/01').getTime()
                },
                onPick({ maxDate, minDate }) {
                    const maxDays = 30
                    const maxRangeTime = maxDays * 24 * 60 * 60 * 1000
                    if (maxDate - minDate > maxRangeTime) {
                        this.$message({
                            message: `日期跨度不能超过${maxDays + 1}天`,
                            type: 'warning'
                        });
                        minDate.setTime(null)
                        maxDate.setTime(null)
                    }
                }
            },
            barFilter: {
                date: []
            },
            barData: {},
            lineFilter: {
                queryDate: '',
                type: 'hour',
                domain: '',
                entry: ''
            },
            lineData: {},
            tableFilter: {
                fromTime: '',
                toTime: ''
            },
            tableData: [],
            dialogVisible: false,
            tableDetailData: [],
            dialogCurrentPage: 1,
            dialogPageSize: 10,
            dialogTotalCount: 0,
            currentIP: '',
            barLoading: false,
            lineLoading: false,
            tableLoading: false,
            dialogTableLoading: false
        }
    },
    computed: {
        domainList() {
            return this.$store.getters['logger/filter/domainList']
        },
        entryList() {
            const currentDomainItem = this.domainList.find(item => item.name === this.lineFilter.domain)
            return currentDomainItem ? currentDomainItem.data : []
        }
    },
    created() {
        this.$store.dispatch('logger/filter/getDomainEntryMapping')
    },
    mounted() {
        this.initDate()
        this.renderBarChart()
        this.renderLineChart()
    },
    watch: {
    },
    methods: {
        initDate() {
            this.barFilter.date.push(util.date.getCurrentMonth() + '-01')
            this.barFilter.date.push(util.date.formatDate(new Date().getTime(), 'yyyy-MM-dd'))
            this.lineFilter.queryDate = util.date.formatDate(new Date().getTime(), 'yyyy-MM-dd')
        },
        renderBarChart() {
            const params = {
                fromDate: this.barFilter.date[0],
                toDate: this.barFilter.date[1]
            }
            this.barLoading = true
            getFlowAnalysisDate(params).then(res => {
                this.barLoading = false
                this.barData = res
            }).catch(error => {
                this.barLoading = false
                this.$message.error(error.msg)
            })
        },
        renderLineChart() {
            this.lineLoading = true
            const { queryDate, type, domain, entry } = this.lineFilter
            const params = { queryDate, type, domain, entry }
            getFlowAnalysisHours(params).then(res => {
                this.lineLoading = false
                this.lineData = res
            }).catch(error => {
                this.lineLoading = false
                this.$message.error(error.msg)
            })
            this.tableFilter.fromTime = ''
            this.tableFilter.toTime = ''
            this.tableData = []
        },
        renderTable() {
            this.tableLoading = true
            const { queryDate, domain, entry } = this.lineFilter
            const { fromTime, toTime } = this.tableFilter
            const params = { queryDate, domain, entry, fromTime, toTime }
            getFlowAnalysisMinute(params).then(res => {
                this.tableLoading = false
                this.tableData = res
            }).catch(error => {
                this.tableLoading = false
                this.$message.error(error.msg)
            })
        },
        renderIPDetail() {
            this.dialogTableLoading = true
            const { queryDate, domain, entry } = this.lineFilter
            const { fromTime, toTime } = this.tableFilter
            const reqIp = this.currentIP
            const pageIndex = this.dialogCurrentPage
            const pageSize = this.dialogPageSize
            const params = { queryDate, domain, entry, fromTime, toTime, reqIp, pageIndex, pageSize }
            getFlowAnalysisMinuteDetail(params).then(res => {
                this.dialogTableLoading = false
                this.tableDetailData = res.list
                this.dialogTotalCount = res.totalCount
            }).catch(error => {
                this.loading = false
                this.$message.error(error.msg)
            })
        },
        handleBarDateChange() {
            this.renderBarChart()
        },
        handleLineDateSearch() {
            this.renderLineChart()
        },
        handleDomainChange() {
            this.lineFilter.entry = ''
        },
        handleTableDataSearch() {
            if (this.tableFilter.fromTime === '' || this.tableFilter.toTime === '') {
                this.$message({
                    message: '请选择时段',
                    type: 'warning'
                });
                return false
            } else {
                this.renderTable()
            }
        },
        handleShowDetail(row) {
            this.dialogVisible = true
            this.currentIP = row.reqIp
            this.renderIPDetail()
        },
        dialogCloseCallback() {
            this.currentIP = ''
            this.tableDetailData = []
            this.dialogTotalCount = 0
        },
        handleDialogCurrentChange() {
            this.renderIPDetail()
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
.section-container {
    margin-bottom: 50px;
    h2 {
        height: 20px;
        line-height: 20px;
        border-left: 2px solid #288df5;
        padding-left: 10px;
        font-size: 16px;
        font-weight: 200;
    }
    .handle-btn {
        color: #1989FA;
        cursor: pointer;
        margin-right: 10px;
        &.disabled {
            color: #ccc;
            cursor: not-allowed;
        }
    }
}
.pagination-wrap {
    margin-top: 10px;
    padding-bottom: 10px;
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
</style>
