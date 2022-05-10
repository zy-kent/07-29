<template>
    <div
        class="main-wrap">
        <main-header></main-header>
        <div class="nav-wrap isfixed">
            <side-nav></side-nav>
        </div>
        <div class="content-wrap content-user">
            <breadcrumb :list="breadCrumbList"></breadcrumb>
            <div style="height:1px; background-color:#F2EFF8;width:calc(100% - 40px);margin:0 auto 10px;"></div>
            <div class="content">
                <transition
                    name="fade"
                    mode="out-in">
                    <router-view></router-view>
                </transition>
            </div>
        </div>
        <main-footer></main-footer>
    </div>
</template>

<script>
import MainHeader from './header'
import SideNav from './nav'
import breadcrumb from './breadcrumb'
import MainFooter from './footer'

export default {
    name: 'Layout',
    components: {
        MainHeader,
        SideNav,
        breadcrumb,
        MainFooter
    },
    data() {
        return {
            breadCrumbList: [{name: '人员管理'}]
        }
    }
}
</script>

<style lang="less">
@import '../../../assets/less/manageCommon.less';
</style>
