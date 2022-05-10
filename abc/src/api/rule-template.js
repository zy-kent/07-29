import request from '@/plugin/axios';

// 通过ID查询模版详情
export function queryConfigDetailById(data) {
    return request({
        url: '/prop/lib/get',
        method: 'post',
        data
    });
}

// 分页查询模版
export function pageQueryTemplate(data) {
    return request({
        url: '/library/list',
        method: 'post',
        data
    });
}

// 新建模版
export function createConfig(data) {
    return request({
        url: '/library/add',
        method: 'post',
        data
    });
}

// 更新模版
export function updateConfig(data) {
    return request({
        url: '/library/mod',
        method: 'post',
        data
    });
}

// 删除模版
export function removeConfig(data) {
    return request({
        url: '/library/del',
        method: 'post',
        data
    });
}

// 查询可配置的规则库类型
export function queryConfigField() {
    return request({
        url: '/library/names/get',
        method: 'get'
    });
}

// 查询默认规则配置

export function queryDefaultConfigDetail(data) {
    return request({
        url: '/prop/get',
        method: 'post',
        data
    });
}
