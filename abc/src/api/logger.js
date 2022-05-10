import request from '@/plugin/axios';

// const prefix = 'http://192.168.161.235:10180/mgsgw'
const prefix = ''
const subfix = ''

// 获取域和入口映射
export function getDomainEntryMappingData() {
    return request({
        url: prefix + '/log/domainEntryMapping' + subfix,
        method: 'post'
    });
}

// 获取概述相关数据
export function getDashboardsData(data) {
    return request({
        url: prefix + '/log/dashboards' + subfix,
        method: 'post',
        data
    });
}

// 获取业务分析字段数据
export function getBusinessFieldData(data) {
    return request({
        url: prefix + '/log/bizAnalysis' + subfix,
        method: 'post',
        data
    });
}

// 获取业务分析字段详情数据
export function getBusinessFieldDetail(data) {
    return request({
        url: prefix + '/log/bizAnalysisDetail' + subfix,
        method: 'post',
        data
    });
}

// 获取业务分析字段聚合数据
export function getBusinessFieldGroup(data) {
    return request({
        url: prefix + '/log/bizAnalysisGroup' + subfix,
        method: 'post',
        data
    });
}

// 获取流量分析日期数据
export function getFlowAnalysisDate(data) {
    return request({
        url: prefix + '/log/flowAnalysisDate' + subfix,
        method: 'post',
        data
    });
}

// 获取流量分析小时数据
export function getFlowAnalysisHours(data) {
    return request({
        url: prefix + '/log/flowAnalysisHours' + subfix,
        method: 'post',
        data
    });
}

// 获取流量分析分钟数据
export function getFlowAnalysisMinute(data) {
    return request({
        url: prefix + '/log/flowAnalysisMinute' + subfix,
        method: 'post',
        data
    });
}

// 获取流量分析分钟详情
export function getFlowAnalysisMinuteDetail(data) {
    return request({
        url: prefix + '/log/flowAnalysisMinuteDetail' + subfix,
        method: 'post',
        data
    });
}

// 获取中国地图数据
export function getChinaMapData() {
    return request({
        url: (process.env.NODE_ENV === 'production' ? '../sgw' : '../..') + '/map/china.json',
        method: 'get'
    })
}

export const columnData = {
    all: [
        'Host',
        'path',
        'user-agent',
        'accept',
        'attackType',
        'isp_domain',
        'region_name',
        'hit',
        'hitLibraryList',
        'libraryTypeList',
        'inputCount',
        'batteryLevel',
        'isCharging',
        'mouseCount',
        'motionCount',
        'xLength',
        'yLength',
        'accessTimeDay',
        'plugins',
        'hasLiedBrowser',
        'cmd.break',
        'timezoneOffset',
        'ctime',
        'openDatabase',
        'flashEnable',
        'if-none-match',
        'canvas',
        'cookie',
        'method',
        'hasLiedOs',
        'version',
        'cmd.insert-probe',
        'request_length',
        'cmd.pass',
        'webrtc',
        'yMotionAccSpeed',
        'touchSupport',
        'gammaScope',
        'accessTimeYear',
        'sgwSessionId',
        'sessionStorage',
        'owner_domain',
        'remoteAddr',
        'xMotionAccSpeed',
        'userAgent',
        'deviceMemory',
        'hardwareConcurrency',
        'doNotTrack',
        'colorDepath',
        'hasInput',
        'accept-encoding',
        'font',
        'referer',
        'accessTimeWeek',
        'hasLiedLanguages',
        'webgl',
        'language',
        'alphaScope',
        '_SG_DT',
        'availableScreenResolution',
        'webdriver',
        'accessTimeMinute',
        'Adblock',
        'screenResolution',
        'batteryChargingTime',
        'cmd.record',
        'accept-language',
        'accessTimeMonth',
        'cmd.set-cookie',
        'indexedDb',
        'standingTime',
        'hasLiedResolution',
        'isJsError',
        'accessTimeHour',
        'pixelRatio',
        'cmd.delay',
        'zMotionAccSpeed',
        'accessTime',
        'cmd.intercept',
        'timezone',
        'localStorage',
        'scrollCount',
        'platform',
        'city_name',
        'focusTime',
        'country_name',
        'Content-Length',
        'cmd.redirect',
        'orientation',
        'latitude',
        'country_code2',
        'continent_code',
        'country_code3',
        'lon',
        'lat',
        'region_code',
        'longitude',
        'betaScope',
        'cpuClass'
    ],
    default: [
        'Host',
        'path',
        'remoteAddr',
        'user-agent',
        'accept',
        'attackType',
        'region_name',
        'hitLibraryList',
        'libraryTypeList',
        'city_name'
    ]
}
