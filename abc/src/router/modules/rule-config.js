import layoutHeaderAside from '@/layout/header-aside';

const meta = { auth: true };

export default {
    path: '/rule-config',
    name: 'rule-config',
    meta: {
        ...meta,
        title: '绑定关系'
    },
    redirect: { name: 'rule-config-form' },
    component: layoutHeaderAside,
    children: (pre => [
        // {
        //     path: 'form',
        //     name: `${pre}form`,
        //     component: () =>
        //         import('@/pages/rule-config/form'),
        //     meta: {...meta,
        //         title: '绑定关系配置'
        //     }
        // },
        {
            path: 'list',
            name: `${pre}list`,
            component: () =>
                import('@/pages/rule-config/list'),
            meta: {...meta,
                title: '绑定关系'
            }
        }
    ])('rule-config-')
};
