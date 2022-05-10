<template>
    <div id="echartsLine" style="width:100%; height: 400px;"></div>
</template>
<script>
import echarts from 'echarts';
export default {
    props: {
        type: String,
        chartData: Object
    },
    data() {
        return {
            chart: undefined
        };
    },
    methods: {
        renderChart() {
            const legendData = []
            this.chartData.series &&
            this.chartData.series.length > 0 &&
            this.chartData.series.forEach(item => {
                legendData.push(item.name)
            })
            const xAxis = this.chartData.columns ? this.chartData.columns : []
            const series = this.chartData.series ? this.chartData.series : []
            series.forEach(item => (item.type = 'line'))
            this.chart = echarts.init(document.querySelector('#echartsLine'));
            this.chart.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    top: 10,
                    left: 'center',
                    data: legendData
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: xAxis
                },
                yAxis: {
                    type: 'value'
                },
                dataZoom: this.type === 'hour' ? [{
                    show: false,
                    realtime: false,
                    start: 0,
                    end: 100
                }] : [{
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 30
                }],
                series
            });
        }
    },
    watch: {
        chartData: {
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
