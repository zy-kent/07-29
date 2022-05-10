import cookies from './util.cookies';
import db from './util.db';
import log from './util.log';
import session from './util.session';
import crypto from './util.crypto';
import uuid from './util.uuid';
import Message from './util.message';
import date from './util.date';
import number from './util.number';

const util = {
    cookies,
    db,
    log,
    session,
    crypto,
    uuid,
    Message,
    date,
    number
};

/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function(titleText) {
    const processTitle = process.env.VUE_APP_TITLE || '云盾';
    window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`;
};

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function(url) {
    var a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    a.setAttribute('id', 'd2admin-link-temp');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(document.getElementById('d2admin-link-temp'));
};

export default util;
