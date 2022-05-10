// 菜单 侧边栏
export default [
    // { path: '/index', title: '首页', icon: '' }, // icon home
    {
        title: '基础配置',
        icon: '',
        path: '/base-config/index'
    },
    {
        title: '规则管理',
        icon: '',
        children: [
            // { path: '/rule-config/form', title: '绑定关系', icon: '' },
            { path: '/rule-template/list', title: '规则列表', icon: '' },
            { path: '/rule-config/list', title: '绑定关系', icon: '' }
        ]
    },
    {
        title: '日志报表',
        icon: '',
        children: [
            { path: '/logger-report/logger', title: '概述', icon: '' },
            { path: '/logger-report/business', title: '业务分析', icon: '' },
            { path: '/logger-report/flow', title: '流量分析', icon: '' }
        ]
    }
];
