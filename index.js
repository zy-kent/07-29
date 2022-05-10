import Vue from 'vue'
import store from '../store/index'
import VueRouter from 'vue-router'
import notFound from '../pages/404'
import login from '../pages/login'
import batLogin from '../pages/batLogin'
import report from '../pages/report'
import bvreport from '../pages/index'
import favorite from '../pages/favorite'
import reportList from '../pages/reportList'
import notice from '../pages/notice'
import downFile from '../pages/downFile'
import noticeDetails from '../pages/noticeDetails'
import auditList from '../pages/auditManage/auditList'
import newAudit from '../pages/auditManage/newAudit'
import auditDetails from '../pages/auditManage/auditDetails'
import { validateLogin } from '../utils/api.js'
// import { validateLogin, validateSinkLogin } from '../utils/api.js';

import { getQueryString } from '../utils/tool'

import layout from '../pages/manage/layout'
import homeTips from '../pages/homeTips'
import reportAuthority from '../pages/manage/reportAuthority'
import userManage from '../pages/manage/userManage'
import interfaceManage from '../pages/manage/interfaceManage'
import groupAuthority from '../pages/manage/groupAuthority'
import noticeManage from '../pages/manage/noticeManage'
import newNotice from '../pages/manage/noticeManage/newOrEditNotice.vue'
import dataUpdate from '../pages/manage/dataUpdate'
import newDataUpdate from '../pages/manage/dataUpdate/newOrEditDataList.vue'
import letters from '../pages/manage/letters/index'
import caliber from '../pages/manage/letters/caliber'
import caliberForm from '../pages/manage/letters/caliberForm'
import tips from '../pages/manage/letters/tips'
import tipsForm from '../pages/manage/letters/tipsForm'
import newLetters from '../pages/manage/letters/letterForm'
import customLetters from '../pages/manage/letters/customIndex'
import newCustomLetters from '../pages/manage/letters/customLetterForm'
import newOrEditReportManage from '../pages/manage/reportAuthority/newOrEditreport.vue'
import newOrEditUserManage from '../pages/manage/userManage/newOrEditUser.vue'
import newOrEditInterfaceManage from '../pages/manage/interfaceManage/newOrEditInterface.vue'
import newOrEditGroupManage from '../pages/manage/groupAuthority/newOrEditGroup.vue'
import maintain from '../pages/manage/maintainDownload'
import newOrEditMaintain from '../pages/manage/maintainDownload/newOrEditMaintain.vue'
import alarmList from '../pages/manage/alarmList/index'
import newOrEditAlarmList from '../pages/manage/alarmList/newOrEditAlarmList'
import alarmLog from '../pages/manage/alarmLog/index'
import newOrEditAlarmLog from '../pages/manage/alarmLog/newOrEditAlarmLog'
import reportMainten from '../pages/manage/reportMainten/index'
import newOrEditReportMainten from '../pages/manage/reportMainten/newOrEditReportMainten'
import jurisdiction from '../pages/manage/jurisdiction/index'
import jurisdictionResources from '../pages/manage/jurisdiction/jurisdictionResources'

// app（旧）
import appList from '../pages/manage/appManage/appList/index'
import newOrEditAppList from '../pages/manage/appManage/appList/newOrEditAppList'
import appNotice from '../pages/manage/appManage/appNotice/index'
import newAppNotice from '../pages/manage/appManage/appNotice/newAppNotice'
import appNoticeDetails from '../pages/manage/appManage/appNotice/appNoticeDetails'
import appTypeConfig from '../pages/manage/appManage/appTypeConfig/index'
import newOrEditAppTypeConfig from '../pages/manage/appManage/appTypeConfig/newOrEditAppTypeConfig'

// app-短信通知
import messagesNotice from '../pages/manage/h5Manage/messagesNotice/index'
import messageForm from '../pages/manage/h5Manage/messagesNotice/messageForm'
import messageInfo from '../pages/manage/h5Manage/messagesNotice/messageInfo'

// app专区-推送通知管理
import h5Notice from '../pages/manage/h5Manage/h5Notice/index'
import newH5Notice from '../pages/manage/h5Manage/h5Notice/newH5Notice'
import h5NoticeDetails from '../pages/manage/h5Manage/h5Notice/h5NoticeDetails'

// app专区-咪咕家推送通知
import pushNotice from '../pages/manage/h5Manage/pushNotice/index'
import newPushNotice from '../pages/manage/h5Manage/pushNotice/newPushNotice'
import pushNoticeDetails from '../pages/manage/h5Manage/pushNotice/pushNoticeDetails'

// app专区-共享报告
import specialReport from '../pages/manage/h5Manage/specialReport/index'
import shareReport from '../pages/shareReport'
import newReport from '../pages/manage/h5Manage/specialReport/newReport'
import newReportConsole from '../pages/manage/h5Manage/specialReport/newReportConsole'

// 指标监控
import appUserDayList from '../pages/manage/indicatorMonitor/alarmRecord/appUserDayList'
import appIncomeDayList from '../pages/manage/indicatorMonitor/alarmRecord/appIncomeDayList'
import appUserMonthList from '../pages/manage/indicatorMonitor/alarmRecord/appUserMonthList'
import appIncomeMonthList from '../pages/manage/indicatorMonitor/alarmRecord/appIncomeMonthList'
import alarmEdit from '../pages/manage/indicatorMonitor/alarmRecord/alarmEdit'

// 监控策略管理
import indicatorMonitorStrategy from '../pages/manage/indicatorMonitor/monitorStrategy/index'
import newOrEditMonitorStrategy from '../pages/manage/indicatorMonitor/monitorStrategy/newOrEditStrategy'

// 角色管理
import roleManage from '../pages/manage/system/role'

//填报中心
import informationEdit from '../pages/manage/information/edit/index'
import informationDataUpdate from '../pages/manage/information/dataUpdate/index'
import informationDataUpdateForm from '../pages/manage/information/dataUpdate/dataUpdateForm';
import informationUnscramble from '../pages/manage/information/unscramble/index'
import informationUnscrambleForm from '../pages/manage/information/unscramble/unscrambleForm.vue'

// 配置中心
import dataService from '../pages/manage/dataService'
import dataServiceForm from '../pages/manage/dataService/dataServiceForm'
Vue.use(VueRouter)

const routes = [{
    path: '*',
    name: '404',
    component: notFound
}, {
    path: '/mgba/login',
    name: 'login',
    component: login
}, {
    path: '/mgba/batlogin',
    name: 'batlogin',
    component: batLogin
}, {
    path: '/mgba/homeTips',
    name: 'homeTips',
    component: homeTips
}, {
    path: '/mgba',
    name: 'bvreport',
    meta: {
        requireAuth: true
    },
    component: bvreport
}, {
    path: '/mgba/downFile',
    name: 'downFile',
    meta: {
        requireAuth: true
    },
    component: downFile
}, {
    path: '/mgba/favorite',
    name: 'favorite',
    meta: {
        requireAuth: true
    },
    component: favorite
}, {
    path: '/mgba/reportList',
    name: 'reportList',
    meta: {
        requireAuth: true
    },
    component: reportList
}, {
    path: '/mgba/notice',
    name: 'notice',
    meta: {
        requireAuth: true
    },
    component: notice
}, {
    path: '/mgba/notice/:themeId',
    name: 'noticeDetails',
    meta: {
        requireAuth: true
    },
    component: noticeDetails
}, {
    path: '/mgba/audit',
    name: 'auditList',
    meta: {
        requireAuth: true
    },
    component: auditList
}, {
    path: '/mgba/newAudit',
    name: 'newAudit',
    meta: {
        requireAuth: true
    },
    component: newAudit
}, {
    path: '/mgba/auditDetails/:auditId',
    name: 'auditDetails',
    meta: {
        requireAuth: true
    },
    component: auditDetails
}, {
    path: '/mgba/manage',
    redirect: { name: 'login' }
}, {
    path: '/mgba/manage/noticeManage',
    name: 'noticeManage',
    meta: {
        requireAuth: true
    },
    component: noticeManage
}, {
    path: '/mgba/manage/noticeManage/:typeName',
    name: 'newNotice',
    meta: {
        requireAuth: true
    },
    component: newNotice
}, {
    path: '/mgba/manage/groupAuthority',
    name: 'groupAuthority',
    meta: {
        requireAuth: true
    },
    component: groupAuthority
}, {
    path: '/mgba/manage/groupAuthority/:typeName',
    name: 'newOrEditGroupManage',
    meta: {
        requireAuth: true
    },
    component: newOrEditGroupManage
}, {
    path: '/mgba/manage/maintain',
    name: 'maintain',
    meta: {
        requireAuth: true
    },
    component: maintain
}, {
    path: '/mgba/manage/maintain/:typeName',
    name: 'newOrEditMaintain',
    meta: {
        requireAuth: true
    },
    component: newOrEditMaintain
}, {
    path: '/mgba/manage/alarmManage',
    name: 'alarmList',
    meta: {
        requireAuth: true
    },
    component: alarmList
}, {
    path: '/mgba/manage/alarmManage/:typeName',
    name: 'newOrEditAlarmList',
    meta: {
        requireAuth: true
    },
    component: newOrEditAlarmList
}, {
    path: '/mgba/manage/alarmLog',
    name: 'alarmLog',
    meta: {
        requireAuth: true
    },
    component: alarmLog
}, {
    path: '/mgba/manage/alarmLog/:typeName',
    name: 'newOrEditAlarmLog',
    meta: {
        requireAuth: true
    },
    component: newOrEditAlarmLog
}, {
    path: '/mgba/manage/reportMainten',
    name: 'reportMainten',
    meta: {
        requireAuth: true
    },
    component: reportMainten
}, {
    path: '/mgba/manage/reportMainten/:typeName',
    name: 'newOrEditReportMainten',
    meta: {
        requireAuth: true
    },
    component: newOrEditReportMainten
}, {
    path: '/mgba/manage/appSubscribeList',
    name: 'appList',
    meta: {
        requireAuth: true
    },
    component: appList
}, {
    path: '/mgba/manage/appSubscribeList/:typeName',
    name: 'newOrEditAppList',
    meta: {
        requireAuth: true
    },
    component: newOrEditAppList
}, {
    path: '/mgba/manage/appNotice',
    name: 'appNotice',
    meta: {
        requireAuth: true
    },
    component: appNotice
}, {
    path: '/mgba/manage/appNotice/:typeName',
    name: 'newAppNotice',
    meta: {
        requireAuth: true
    },
    component: newAppNotice
}, {
    path: '/mgba/manage/appNoticeDetails/:typeName',
    name: 'appNoticeDetails',
    meta: {
        requireAuth: true
    },
    component: appNoticeDetails
},
{
    path: '/mgba/manage/indicatorMonitorAlarmEdit/:id',
    name: 'alarmEdit',
    meta: {
        requireAuth: true
    },
    component: alarmEdit
},
{
    path: '/mgba/manage/appTypeConfig',
    name: 'appTypeConfig',
    meta: {
        requireAuth: true
    },
    component: appTypeConfig
}, {
    path: '/mgba/manage/appTypeConfig/:typeName',
    name: 'newOrEditAppTypeConfig',
    meta: {
        requireAuth: true
    },
    component: newOrEditAppTypeConfig
},
// app管理系统相关路由
{
    path: '/mgba/manage',
    name: 'layout',
    component: layout,
    meta: {
        requireAuth: true
    },
    children: [{ // 页面管理
        path: '/mgba/manage/letters/custom',
        name: 'customLetters',
        meta: {
            requireAuth: true
        },
        component: customLetters
    }, { // 权限资源
        path: '/mgba/manage/jurisdiction',
        name: 'jurisdiction',
        meta: {
            requireAuth: true
        },
        component: jurisdiction
    }, { // 权限资源
        path: '/mgba/manage/jurisdiction/:typeName',
        name: 'jurisdictionResources',
        meta: {
            requireAuth: true
        },
        component: jurisdictionResources
    }, { // 页面管理
        path: '/mgba/manage/letters/customForm',
        name: 'newCustomLetters',
        meta: {
            requireAuth: true
        },
        component: newCustomLetters
    }, { // 角色管理
        path: '/mgba/manage/system/role',
        name: 'roleManage',
        meta: {
            requireAuth: true
        },
        component: roleManage
    }, { // 用户管理
        path: '/mgba/manage/userManage',
        name: 'userManage',
        meta: {
            requireAuth: true
        },
        component: userManage
    }, { // 用户管理
        path: '/mgba/manage/userManage/:typeName',
        name: 'newOrEditUserManage',
        meta: {
            requireAuth: true
        },
        component: newOrEditUserManage
    }, { // 接口管理
        path: '/mgba/manage/interfaceManage',
        name: 'interfaceManage',
        meta: {
            requireAuth: true
        },
        component: interfaceManage
    }, { // 接口管理
        path: '/mgba/manage/interfaceManage/:typeName',
        name: 'newOrEditInterfaceManage',
        meta: {
            requireAuth: true
        },
        component: newOrEditInterfaceManage
    }, { // 浮窗管理
        path: '/mgba/manage/caliber/index',
        name: 'caliber',
        meta: {
            requireAuth: true
        },
        component: caliber
    }, { // 浮窗管理
        path: '/mgba/manage/caliber/caliberForm',
        name: 'caliberForm',
        meta: {
            requireAuth: true
        },
        component: caliberForm
    }, { // 挂件管理
        path: '/mgba/manage/letters/tips',
        name: 'tips',
        meta: {
            requireAuth: true
        },
        component: tips
    }, { // 挂件管理
        path: '/mgba/manage/letters/tipsForm',
        name: 'tipsForm',
        meta: {
            requireAuth: true
        },
        component: tipsForm
    }, { // 咪咕家push通知
        path: '/mgba/manage/pushNotice',
        name: 'pushNotice',
        meta: {
            requireAuth: true
        },
        component: pushNotice
    }, { // 咪咕家push通知
        path: '/mgba/manage/pushNotice/:typeName',
        name: 'newPushNotice',
        meta: {
            requireAuth: true
        },
        component: newPushNotice
    }, { // 咪咕家push通知
        path: '/mgba/manage/pushNoticeDetails/:id',
        name: 'pushNoticeDetails',
        meta: {
            requireAuth: true
        },
        component: pushNoticeDetails
    }, { // 短信通知
        path: '/mgba/manage/messagesNotice',
        name: 'messagesNotice',
        meta: {
            requireAuth: true
        },
        component: messagesNotice
    }, { // 短信通知
        path: '/mgba/manage/messageForm',
        name: 'messageForm',
        meta: {
            requireAuth: true
        },
        component: messageForm
    }, { // 短信通知
        path: '/mgba/manage/messageInfo',
        name: 'messageInfo',
        meta: {
            requireAuth: true
        },
        component: messageInfo
    }, { // 应用内通知
        path: '/mgba/manage/h5Notice',
        name: 'h5Notice',
        meta: {
            requireAuth: true
        },
        component: h5Notice
    }, { // 应用内通知
        path: '/mgba/manage/h5Notice/:typeName',
        name: 'newH5Notice',
        meta: {
            requireAuth: true
        },
        component: newH5Notice
    }, { // 应用内通知
        path: '/mgba/manage/h5NoticeDetails/:id',
        name: 'h5NoticeDetails',
        meta: {
            requireAuth: true
        },
        component: h5NoticeDetails
    }, { // 我上传的报告
        path: '/mgba/shareReport',
        name: 'shareReport',
        meta: {
            requireAuth: true
        },
        component: shareReport
    }, { // 我上传的报告
        path: '/mgba/specialReport/newReport',
        name: 'newReport',
        meta: {
            requireAuth: true
        },
        component: newReport
    }, { // 报告管理
        path: '/mgba/manage/specialReport',
        name: 'specialReport',
        meta: {
            requireAuth: true
        },
        component: specialReport,
        props: false
    }, { // 报告管理
        path: '/mgba/manage/specialReport/console/:typeName',
        name: 'newReportConsole',
        meta: {
            requireAuth: true
        },
        component: newReportConsole
    }, { // 模板页面
        path: '/mgba/manage/letters/index',
        name: 'letters',
        meta: {
            requireAuth: true
        },
        component: letters
    }, { // 模板页面
        path: '/mgba/manage/letters/letterForm',
        name: 'newLetters',
        meta: {
            requireAuth: true
        },
        component: newLetters
    }, { // 数据服务配置
        path: '/mgba/manage/dataService',
        name: 'dataService',
        meta: {
            requireAuth: true
        },
        component: dataService
    }, { // 数据服务配置新增编辑
        path: '/mgba/manage/dataServiceForm',
        name: 'dataServiceForm',
        meta: {
            requireAuth: true
        },
        component: dataServiceForm
    }, { // 监控策略管理
        path: '/mgba/manage/indicatorMonitorStrategy',
        name: 'indicatorMonitorStrategy',
        meta: {
            requireAuth: true
        },
        component: indicatorMonitorStrategy
    }, { // 监控策略管理
        path: '/mgba/manage/indicatorMonitorStrategy/:typeName',
        name: 'newOrEditMonitorStrategy',
        meta: {
            requireAuth: true
        },
        component: newOrEditMonitorStrategy
    }, { // 宽表告警记录
        path: '/mgba/manage/indicatorMonitorAppUserDay',
        name: 'appUserDayList',
        meta: {
            requireAuth: true
        },
        component: appUserDayList
    }, { // 宽表告警记录
        path: '/mgba/manage/indicatorMonitorAppIncomeDay',
        name: 'appIncomeDayList',
        meta: {
            requireAuth: true
        },
        component: appIncomeDayList
    }, { // 宽表告警记录
        path: '/mgba/manage/indicatorMonitorAppUserMonth',
        name: 'appUserMonthList',
        meta: {
            requireAuth: true
        },
        component: appUserMonthList
    }, { // 宽表告警记录
        path: '/mgba/manage/indicatorMonitorAppIncomeMonth',
        name: 'appIncomeMonthList',
        meta: {
            requireAuth: true
        },
        component: appIncomeMonthList
    }, { // 表格上传
        path: '/mgba/manage/dataUpdate',
        name: 'dataUpdate',
        meta: {
            requireAuth: true
        },
        component: dataUpdate
    }, { // 数据填报
        path: '/mgba/manage/information/edit',
        name: 'informationEdit',
        meta: {
            requireAuth: true
        },
        component: informationEdit
    }, { // 数据解读
        path: '/mgba/manage/information/unscramble',
        name: 'informationUnscramble',
        meta: {
            requireAuth: true
        },
        component: informationUnscramble
    }, { // 数据解读-编辑新增页面
        path: '/mgba/manage/information/unscrambleForm',
        name: 'informationUnscrambleForm',
        meta: {
            requireAuth: true
        },
        component: informationUnscrambleForm
    }, { // 文档上传
        path: '/mgba/manage/information/dataUpdate',
        name: 'informationDataUpdate',
        meta: {
            requireAuth: true
        },
        component: informationDataUpdate
    }, { // 文档上传
        path: '/mgba/manage/information/dataUpdateForm',
        name: 'informationDataUpdateForm',
        meta: {
            requireAuth: true
        },
        component: informationDataUpdateForm
    }, { // 数据上传
        path: '/mgba/manage/dataUpdate/:typeName',
        name: 'newDataUpdate',
        meta: {
            requireAuth: true
        },
        component: newDataUpdate
    }, { // 报表配置
        path: '/mgba/manage/reportAuthority',
        name: 'reportAuthority',
        meta: {
            requireAuth: true
        },
        component: reportAuthority
    }, { // 报表配置
        path: '/mgba/manage/reportAuthority/:typeName',
        name: 'newOrEditReportManage',
        meta: {
            requireAuth: true
        },
        component: newOrEditReportManage
    }, { // 数据确认
        path: '/mgba/report/:id',
        name: 'report',
        meta: {
            requireAuth: true
        },
        component: report
    }]
}]

const Router = new VueRouter({
    mode: 'history',
    routes: routes
})

Router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        const qs = getQueryString()
        const isLogout = localStorage.getItem('ssoToken') === 'logout'
        if (isLogout) {
            localStorage.removeItem('ssoToken')
        }
        const sysToken = localStorage.getItem('batToken') || localStorage.getItem('bvreportUserName') || localStorage.getItem('ssoToken') || qs['token']
        const validateUserLogin = () => {
            validateLogin().then(res => {
                if (res.rspcode === 0) {
                    localStorage.setItem('batUrl', null)
                    localStorage.setItem('unifiedUserId', res.data.userId)
                    localStorage.setItem('bvreportUserName', res.data.userName)
                    localStorage.setItem('bvreportToken', res.data.token)
                    localStorage.setItem('bvreportPhoneNum', res.data.phoneNum)
                    localStorage.setItem('bvreportAuth', res.data.menuAuth)
                    localStorage.setItem('bvreportIsOA', res.data.isOa)
                    store.dispatch('setUserName', res.data.userName)
                    store.commit('initCurrentNavList', res.data.menuAuth)
                    next()
                } else {
                    setTimeout(() => {
                        Router.replace({
                            name: 'login'
                        })
                    }, 1000)
                }
            })
        }
        // 初始化菜单
        const menuAuth = localStorage.getItem('bvreportAuth')
        if (menuAuth && menuAuth !== '') {
            store.commit('initCurrentNavList', menuAuth)
        }
        if (qs.from === 'oa') {
            // 如果是从oa跳转过来的
            localStorage.clear()
            validateUserLogin()
        } else if (sysToken) {
            const userName = localStorage.getItem('bvreportUserName')
            if (userName) {
                const batUrl = localStorage.getItem('batUrl')
                if (batUrl) {
                    validateUserLogin()
                } else {
                    next()
                }
            } else {
                validateUserLogin()
            }
        } else {
            Router.replace({
                name: 'login'
            })
        }
    } else {
        next()
    }
})

export default Router
