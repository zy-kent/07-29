<template>
    <div id="echartsMap" style="height: 600px;"></div>
</template>
<script>
import echarts from 'echarts'
import { getChinaMapData } from '@/api/logger'
import util from '@/libs/util'
export default {
    props: {
        mapData: Array
    },
    data() {
        return {
            chart: undefined,
            provinceNameList: [{
                name: '安徽',
                code: 'Anhui'
            }, {
                name: '浙江',
                code: 'Zhejiang'
            }, {
                name: '江西',
                code: 'Jiangxi'
            }, {
                name: '江苏',
                code: 'Jiangsu'
            }, {
                name: '吉林',
                code: 'Jilin'
            }, {
                name: '青海',
                code: 'Qinghai'
            }, {
                name: '福建',
                code: 'Fujian'
            }, {
                name: '黑龙江',
                code: 'Heilongjiang'
            }, {
                name: '河南',
                code: 'Henan'
            }, {
                name: '河北',
                code: 'Hebei'
            }, {
                name: '湖南',
                code: 'Hunan'
            }, {
                name: '湖北',
                code: 'Hubei'
            }, {
                name: '新疆',
                code: 'Xinjiang'
            }, {
                name: '西藏',
                code: 'Xizang'
            }, {
                name: '甘肃',
                code: 'Gansu'
            }, {
                name: '广西',
                code: 'Guangxi'
            }, {
                name: '贵州',
                code: 'Guizhou'
            }, {
                name: '辽宁',
                code: 'Liaoning'
            }, {
                name: '内蒙古',
                code: 'Nei Mongol'
            }, {
                name: '宁夏',
                code: 'Ningxia'
            }, {
                name: '北京',
                code: 'Beijing'
            }, {
                name: '上海',
                code: 'Shanghai'
            }, {
                name: '山西',
                code: 'Shanxi'
            }, {
                name: '山东',
                code: 'Shandong'
            }, {
                name: '陕西',
                code: 'Shaanxi'
            }, {
                name: '天津',
                code: 'Tianjin'
            }, {
                name: '云南',
                code: 'Yunnan'
            }, {
                name: '广东',
                code: 'Guangdong'
            }, {
                name: '海南',
                code: 'Hainan'
            }, {
                name: '四川',
                code: 'Sichuan'
            }, {
                name: '重庆',
                code: 'Chongqing'
            }]
        };
    },
    computed: {
        min() {
            return 0
        },
        max() {
            const numArr = this.mapData.map(item => item.value).sort((a, b) => b - a)
            const maxNum = numArr[0]
            const max = (Number(String(maxNum)[0]) + 1) * Math.pow(10, String(maxNum).length - 1)
            return max
        }
    },
    methods: {
        renderMap() {
            this.chart = echarts.init(document.querySelector('#echartsMap'));
            getChinaMapData().then(geoJson => {
                echarts.registerMap('china', geoJson)
            })
        },
        renderChart() {
            const formatMapData = (mapData) => {
                return mapData.map(item => {
                    const currentProvince = this.provinceNameList.find(provinceItem => provinceItem.code.toLowerCase() === item.name.toLowerCase())
                    return {
                        name: currentProvince ? currentProvince.name : null,
                        value: item.value
                    }
                })
            }
            this.chart.setOption({
                tooltip: {
                    trigger: 'item',
                    showDelay: 0,
                    transitionDuration: 0.2,
                    formatter: function (params) {
                        let value = (params.value + '').split('.')
                        value = util.number.format(value[0])
                        value = value === 'NaN' ? 0 : value
                        return params.name + ': ' + value
                    }
                },
                visualMap: {
                    min: this.min,
                    max: this.max || 10000,
                    text: ['高', '低'],
                    realtime: false,
                    calculable: true,
                    inRange: {
                        color: ['lightskyblue', 'yellow', 'orangered']
                    }
                },
                series: [
                    {
                        name: '中国',
                        type: 'map',
                        mapType: 'china',
                        zoom: 1.2,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true
                                }
                            },
                            emphasis: {
                                label: {
                                    show: true
                                }
                            }
                        },
                        data: formatMapData(this.mapData)
                    }
                ]
            });
        }
    },
    watch: {
        mapData: {
            handler(newValue, oldValue) {
                this.$nextTick(() => {
                    this.renderChart()
                })
            },
            deep: true
        }
    },
    mounted() {
        this.renderMap();
        this.renderChart();
    }
};
</script>
