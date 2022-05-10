<template>
    <d2-container :filename="filename">
        <template slot="header">
            <mg-breadcrumb />
        </template>
        <div class="page-container d2-clearfix report-slider" v-loading="loading" element-loading-text="数据加载中...">
            <div class="filter-container" v-if="filterShow">
                <i class="icon el-icon-close filter-close-btn" @click="filterShow = false" title="关闭筛选"></i>
                <el-form
                    ref="formFilter"
                    :inline="true"
                    :model="overviewFilter"
                    class="filter-container"
                    size="small"
                    @submit.native.prevent>
                    <el-form-item label="日期范围">
                        <el-date-picker
                            v-model="overviewFilter.date"
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
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="域">
                        <el-select v-model="overviewFilter.domain" multiple placeholder="请选择域名">
                            <el-option
                                v-for="item in domainList"
                                :key="item.name"
                                :label="item.name"
                                :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :loading="loading" @click="handleSearch">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="request-total">
                <i class="icon el-icon-s-operation filter-toggle-btn" @click="filterShow = !filterShow" title="打开筛选"></i>
                <div class="request-total-item">
                    <d2-count-up
                        class="request-total-number"
                        :end="regNum.totalReq"
                        style="color: #19d4ae;"
                    />
                    <div class="request-total-text">总请求量</div>
                </div>
                <div class="request-total-item">
                    <d2-count-up
                        class="request-total-number"
                        :end="regNum.normalReq"
                        style="color: #5ab1ef;"
                    />
                    <div class="request-total-text">正常请求量</div>
                </div>
                <div class="request-total-item">
                    <d2-count-up
                        class="request-total-number"
                        :end="regNum.exceptionReq"
                        style="color: #ff7993;"
                    />
                    <div class="request-total-text">规则触碰量</div>
                </div>
                <div class="request-total-item">
                    <d2-count-up
                        class="request-total-number"
                        :end="regNum.whiteListReq"
                        style="color: #ffb980;"
                    />
                    <div class="request-total-text">白名单量</div>
                </div>
            </div>
            <div class="map-container">
                <province-modal
                    :mapData="mapData">
                </province-modal>
            </div>
            <div class="pie-container">
                <div class="pie-container-item">
                    <pie-modal
                        :title="exceptionTitle"
                        :legendData="exceptionLegendData"
                        :pieData="exceptionPieData">
                    </pie-modal>
                </div>
                <div class="pie-container-item">
                    <pie-modal
                        :title="automationTitle"
                        :legendData="automationLegendData"
                        :pieData="automationPieData">
                    </pie-modal>
                </div>
            </div>
        </div>
    </d2-container>
</template>

<script>
import ProvinceModal from './components/ProvinceModal'
import PieModal from './components/PieModal'
import util from '@/libs/util';
import { getDashboardsData } from '@/api/logger'

export default {
    name: 'LoggerIndex',
    components: {
        ProvinceModal,
        PieModal
    },
    mixins: [],
    data() {
        return {
            filename: __filename,
            loading: false,
            filterShow: false,
            overviewFilter: {
                date: [],
                domain: []
            },
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
            regNum: {
                totalReq: 0,
                normalReq: 0,
                exceptionReq: 0,
                whiteListReq: 0
            },
            min: 0,
            max: 20000,
            mapData: [],
            exceptionTitle: '规则类型占比',
            exceptionLegendData: [],
            exceptionPieData: [],
            automationTitle: '自动化工具占比',
            automationLegendData: [],
            automationPieData: []
        };
    },
    computed: {
        domainList() {
            return this.$store.getters['logger/filter/domainList']
        }
    },
    created() {
        this.$store.dispatch('logger/filter/getDomainEntryMapping')
    },
    mounted() {
        this.initDate()
        this.getDashboards()
    },
    watch: {
    },

    methods: {
        initDate() {
            this.overviewFilter.date.push(util.date.getCurrentMonth() + '-01')
            this.overviewFilter.date.push(util.date.formatDate(new Date().getTime(), 'yyyy-MM-dd'))
        },
        getDashboards() {
            const params = {
                fromDate: this.overviewFilter.date[0],
                toDate: this.overviewFilter.date[1],
                domain: this.overviewFilter.domain
            }
            this.loading = true
            getDashboardsData(params).then(res => {
                this.loading = false
                Object.keys(this.regNum).forEach(item => {
                    this.regNum[item] = res[item]
                })
                this.mapData = res.regionReqList.map(item => {
                    const reg = /(省|自治区|壮族|回族|维吾尔|特别行政区)/g
                    item.name = item.name.replace(reg, '')
                    return item
                })
                this.exceptionLegendData = res.exceptionPercent && res.exceptionPercent.map(item => item.name)
                this.exceptionPieData = res.exceptionPercent
                this.automationLegendData = res.toolsPercent && res.toolsPercent.map(item => item.name)
                this.automationPieData = res.toolsPercent
            }).catch(error => {
                this.loading = false
                this.$message.error(error.msg)
            })
        },
        handleSearch() {
            this.getDashboards()
        }
    }
};
</script>
<style lang="less" scoped>
.page-container {
    background: none;
    border: none;
}
.request-total {
    position: relative;
    display: flex;
    min-width: 1300px;
    justify-content: space-around;
    border-bottom: 1px solid #ebf5ee;
    padding-bottom: 30px;
    padding-top: 30px;
    margin-bottom: 20px;
    background: #fff;
    box-shadow: 0 0 1px #ccc;
    border-radius: 5px;
    &-item {
        text-align: center;
    }
    &-number {
        font-size: 48px;
        font-weight: bolder;
    }
    &-text {
        margin-top: 10px;
        font-size: 14px;
        font-weight: bolder;
        color: #737687;
    }
    .filter-toggle-btn {
        font-size: 24px;
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
    }
}
.report-slider {
    .el-slider__bar {
        background: #e4e7ed;
    }
}
.filter-container {
    margin-bottom: 20px;
    position: relative;
    .filter-close-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        font-size: 24px;
        cursor: pointer;
        z-index: 1;
    }
}
.map-container {
    margin-bottom: 100px;
}
.pie-container {
    width: 100%;
    min-width: 1300px;
    overflow: hidden;
    font-size: 0;
    .pie-container-item {
        display: inline-block;
        width: 50%;
    }
}
</style>
