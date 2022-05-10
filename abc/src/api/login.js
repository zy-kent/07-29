import request from '@/plugin/axios';

// 登录
export function AccountLogin(data) {
    return request({
        url: '/login',
        method: 'post',
        data
    });
}
// 注销
export function AccountLogout(data) {
    return request({
        url: '/logout',
        method: 'post',
        data
    });
}

// 获取服务器时间戳
export function timeSync(data) {
    return request({
        url: '/time/sync',
        method: 'get',
        data
    });
}
