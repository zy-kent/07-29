import layoutHeaderAside from '@/layout/header-aside'

const meta = { auth: true }

export default {
    path: '/base-config',
    name: 'base-config',
    meta,
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: (pre => [{
        path: 'index',
        name: `${pre}index`,
        component: () =>
            import('@/pages/base-config/index'),
        meta: { meta, title: '基础配置' }
    }])('base-config-')
}
