// 基础配置页面对应api

import request from '@/plugin/axios';

// 分页查询规则配置
export function pageQueryRule(data) {
    return request({
        url: '/bind/list',
        method: 'post',
        data
    });
}

// 查询所有默认处置方式
export function queryActionList(data) {
    return request({
        url: `/action/get/${data}`,
        method: 'get'
    });
}
// 查询处置方式默认参数
export function queryActionParams(actionName) {
    return request({
        url: '/prop/action/get',
        method: 'post',
        data: {
            actionName
        }
    });
}

// 根据ID查询处置方式参数
export function queryActionParamsById(actionId) {
    return request({
        url: '/action/get',
        method: 'post',
        data: {
            actionId
        }
    });
}

// 新建绑定
export function createBind(data) {
    return request({
        url: '/bind/add',
        method: 'post',
        data
    });
}
// 更新绑定
export function updateBind(data) {
    return request({
        url: '/bind/mod',
        method: 'post',
        data
    });
}
// 查询单条绑定
export function queryBind(data) {
    return request({
        url: '/bind/add',
        method: 'post',
        data
    });
}

// 删除处置方式默认参数
export function deleteBind(data) {
    return request({
        url: '/bind/del',
        method: 'post',
        data
    });
}

// 开关
export function switchBind(data) {
    return request({
        url: '/bind/switch',
        method: 'post',
        data
    });
}
