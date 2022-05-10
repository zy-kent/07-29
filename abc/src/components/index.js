import Vue from 'vue';
import ZkTable from 'vue-table-with-tree-grid';
import d2Container from './global/d2-container';

// 注意 有些组件使用异步加载会有影响
Vue.component('d2-container', d2Container);
Vue.component('d2-page-cover', () => import('./global/d2-page-cover'));
Vue.component('d2-icon', () => import('./global/d2-icon'));
Vue.component('d2-icon-svg', () => import('./global/d2-icon-svg/index.vue'));
Vue.component('mg-breadcrumb', () => import('./global/mg-breadcrumb/index.vue'));
Vue.component('d2-count-up', () => import('./global/d2-count-up/index.vue'));
Vue.component(ZkTable.name, ZkTable);
