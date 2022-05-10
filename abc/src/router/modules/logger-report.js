import layoutHeaderAside from '@/layout/header-aside';

const meta = { auth: true };

export default {
    path: '/logger-report',
    name: 'log-report',
    meta,
    redirect: { name: 'logger-report-logger' },
    component: layoutHeaderAside,
    children: (pre => [
        {
            path: 'logger',
            name: `${pre}logger`,
            component: () => import('@/pages/logger-report/logger'),
            meta: { meta, title: '概述' }
        },
        {
            path: 'business',
            name: `${pre}business`,
            component: () => import('@/pages/logger-report/business'),
            meta: { meta, title: '业务分析' }
        },
        {
            path: 'flow',
            name: `${pre}report-form`,
            component: () => import('@/pages/logger-report/flow'),
            meta: { meta, title: '流量分析' }
        }
    ])('logger-report-')
};
