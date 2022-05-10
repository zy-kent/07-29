// 基础配置页面对应api

import request from '@/plugin/axios'

// 分页查询域名配置
export function pageQueryDomain(data) {
    return request({
        url: '/domain/list',
        method: 'post',
        data
    })
}
// 添加域
export function createDomain(data) {
    return request({
        url: '/domain/add',
        method: 'post',
        data
    })
}
// 修改域
export function editDomain(data) {
    return request({
        url: '/domain/mod',
        method: 'post',
        data
    })
}

// 删除域
export function removeDomain(data) {
    return request({
        url: '/domain/del',
        method: 'post',
        data
    })
}

// 业务服务检查
export function checkServer(data, timeout) {
    return request({
        url: '/target/test',
        method: 'post',
        data,
        timeout
    })
}

// 查询单条域配置
export function queryDomainById(domainId) {
    return request({
        url: '/domain/get',
        method: 'post',
        data: {
            domainId
        }
    })
}

// 获取映射端口
export function getMappingPort(data) {
    return request({
        url: '/port/get',
        method: 'post',
        data
    })
}
