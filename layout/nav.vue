<template>
    <nav class="header-app-nav header-app-nav-manage">
        <el-menu
            :default-active="activeIndex"
            :router="true"
            :unique-opened="true"
            class="el-menu-demo"
            mode="vertical">
            <template v-for="item in sideNavList">
                <el-submenu
                    v-if="item.subNav && item.subNav.length"
                    :index="String(item.id)"
                    :key="item.id">
                    <template slot="title">
                        <i
                            :class="item.icon || ''"
                            class="icon"></i> {{ item.name }}
                    </template>
                    <template v-for="child in item.subNav">
                        <el-menu-item
                            :key="child.id"
                            :index="child.link">{{ child.name }}</el-menu-item>
                    </template>
                </el-submenu>
                <el-menu-item
                    v-else
                    v-show="!item.hide"
                    :key="item.id"
                    :to="item.link"
                    :index="item.link">
                    <i
                        :class="item.icon || ''"
                        class="icon"></i> {{ item.name }}
                </el-menu-item>
            </template>
        </el-menu>
    </nav>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'

export default {
    data() {
        return {
            sideNavList: [],
            activeIndex: ''
        }
    },
    computed: {
        ...mapState({
            nav: 'nav'
        })
    },
    watch: {
        '$route': {
            handler() {
                this.initSideNav()
            },
            immediate: true
        }
    },
    methods: {
        checkUpdateDataType() { // 判断是否是数据上传人员
            const currentAuthTypeArr = localStorage.getItem('bvreportAuth').split(',')
            return currentAuthTypeArr.includes('4') && !(currentAuthTypeArr.includes('1') || currentAuthTypeArr.includes('2') || currentAuthTypeArr.includes('3'))
        },
        initSideNav() {
            const path = this.$route.path
            let currentItem = null
            this.nav.navList.forEach(item => {
                let link = null
                item.subNav.forEach(subItem => {
                    if (subItem.id === 42 && this.checkUpdateDataType()) { // 单独处理数据上传人员的菜单权限
                        subItem.hide = true
                    } else {
                        if (subItem.link) {
                            let isExLink = false
                            if (subItem.exLink && subItem.exLink.length > 0) {
                                subItem.exLink.forEach(item => {
                                    if (path.indexOf(item) !== -1) {
                                        isExLink = true
                                    }
                                })
                            }
                            if (subItem.link === path || isExLink) {
                                link = subItem.link
                            }
                        } else {
                            subItem.subNav.forEach(thirdLevel => {
                                if (thirdLevel.link === path) {
                                    link = thirdLevel.link
                                }
                            })
                        }
                    }
                })
                if (link) {
                    currentItem = item
                    this.activeIndex = link
                }
            })
            this.sideNavList = currentItem.subNav
        }
    }
}
</script>

<style lang="less">
@import '../../../assets/less/manageCommon.less';
</style>
