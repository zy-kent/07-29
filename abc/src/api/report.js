import request from '@/plugin/axios';

// 新建图表
export function createReport() {
    return request({
        url: '/log/column/get',
        method: 'get'
    });
}
// 获取图表信息
export function queryReportDetail(data) {
    return request({
        url: '/log/list',
        method: 'post',
        data
    });
}
// 删除图表
export function deleteReport() {
    return request({
        url: '',
        method: '',
        data: ' '
    });
}
// 修改图表信息
export function updateReport() {
    return request({
        url: '',
        method: '',
        data: ' '
    });
}

// 根据行查询列，及统计信息
export function queryColFields(row) {
    return request({
        url: '',
        method: '',
        data: ' '
    });
}

// 查询表格类型信息
export function quertChartType() {
    return request({
        url: '',
        method: '',
        data: ' '
    });
}

// 查询行信息
export function queryRowFields() {
    return request({
        url: '',
        method: '',
        data: ' '
    });
}
