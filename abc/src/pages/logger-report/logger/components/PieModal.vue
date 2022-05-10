<template>
    <div :id="`echartsPie${id}`" style="height: 400px;"></div>
</template>
<script>
import echarts from 'echarts'
import util from '@/libs/util'
export default {
    props: {
        title: String,
        legendData: Array,
        pieData: Array
    },
    data() {
        const id = Math.floor(Math.random() * 100000)

        return {
            chart: undefined,
            id
        };
    },
    methods: {
        renderChart() {
            this.chart = echarts.init(document.querySelector(`#echartsPie${this.id}`))
            this.chart.setOption({
                title: {
                    text: this.title,
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    // formatter: this.title + '<br/>{b} : {c} ({d}%)'
                    formatter: function (params) {
                        return `${params.name}: ${util.number.format(params.value)} (${params.percent}%)`
                    }
                },
                legend: {
                    bottom: 0,
                    left: 'center',
                    data: this.legendData
                },
                series: [{
                    type: 'pie',
                    radius: '45%',
                    center: ['50%', '50%'],
                    selectedMode: 'single',
                    data: this.pieData
                }]
            });
        }
    },
    watch: {
        pieData: {
            handler(newValue, oldValue) {
                this.$nextTick(() => {
                    this.renderChart()
                })
            },
            deep: true
        }
    },
    mounted() {
        this.renderChart();
    }
};
</script>
