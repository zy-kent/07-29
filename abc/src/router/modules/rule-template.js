import layoutHeaderAside from '@/layout/header-aside';

const meta = { requiresAuth: true };

export default {
    path: '/rule-template',
    name: 'rule-template',
    meta,
    redirect: { name: 'rule-template-list' },
    component: layoutHeaderAside,
    children: (pre => [{
        path: 'list',
        name: `${pre}list`,
        component: () =>
                import('@/pages/rule-template/list'),
        meta: { meta, title: '规则列表' }
    }
    // {
    //     path: 'form',
    //     name: `${pre}form`,
    //     component: () =>
    //             import('@/pages/rule-template/form'),
    //     meta: { meta, title: '规则表单' }
    // }
    ])('rule-template-')
};
