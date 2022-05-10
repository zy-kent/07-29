/**
 * 留位置， 万一以后要推向世界
 */
import Vue from 'vue';
import VueI18n from 'vue-i18n';

import cn from './lang/cn';
import en from './lang/en';

Vue.use(VueI18n);

export default new VueI18n({
    locale: 'cn',
    messages: {
        cn,
        en
    }
});
