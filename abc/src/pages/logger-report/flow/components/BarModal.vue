<template>
    <div id="echartsBar" style="width:100%; height: 400px;"></div>
</template>
<script>
import echarts from 'echarts';
export default {
    props: {
        title: String,
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
            series.forEach(item => (item.type = 'bar'))
            this.chart = echarts.init(document.querySelector('#echartsBar'));
            this.chart.setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    top: 10,
                    left: 'center',
                    data: legendData
                },
                xAxis: {
                    type: 'category',
                    data: xAxis
                },
                yAxis: {
                    type: 'value'
                },
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
