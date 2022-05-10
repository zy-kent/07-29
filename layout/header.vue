<template>
    <header class="header manage-header">
        <div class="logo"></div>
        <div class="head-nav">
            <template
                v-for="item in navList">
                <router-link
                    :to="item.link"
                    :key="item.id">
                    <el-button
                        :class="activeId !== item.id ? 'no-active' : ''"
                        type="primary"
                        size="medium"
                        round>{{ item.name }}</el-button>
                </router-link>
            </template>
        </div>
        <login-info></login-info>
    </header>
</template>

<script type="text/ecmascript-6">
import loginInfo from './loginInfo'
import { mapState } from 'vuex'

export default {
    components: {
        'login-info': loginInfo
    },
    data() {
        return {
            navList: [],
            activeId: 1
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
                this.initAuthNav()
                this.initActive()
            },
            immediate: true
        }
    },
    methods: {
        initAuthNav() {
            this.navList = this.nav.currentNavList.map(item => {
                if (item) {
                    const { id, name } = item
                    let link = item.subNav[0].link
                    if (!link) {
                        link = item.subNav[0].subNav[0].link
                    }
                    return {
                        id,
                        name,
                        link
                    }
                }
            })
        },
        initActive() {
            const path = this.$route.path
            let currentItem = null
            this.nav.currentNavList.forEach(item => {
                let link = null
                item.subNav.forEach(subItem => {
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
                })
                if (link) {
                    currentItem = item
                }
            })
            this.activeId = currentItem ? currentItem.id : 1
        }
    }
}
</script>

<style lang="less">
.manage-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width:100%;
  height:60px;
  min-width: 1300px;
  background: #262B2E;
  .logo {
    position: relative;
    top: 15px;
    left: 20px;
    width: 160px;
    height: 30px;
    background: url(../../../assets/images/manage_logo.png) no-repeat center;
    background-size: contain;
  }
  .head-nav {
    position: absolute;
    top: 14px;
    left: 220px;
    .el-button--primary {
      padding: 0 20px;
      height: 30px;
    }
    .el-button--primary.no-active {
      background: none;
      border: none;
    }
  }
  .login-info.login-info-manage {
    .logout-btn {
      box-shadow: 0 1px 1px #ddd;
      button {
        width: 90px;
        padding: 0px 20px;
        i {
          color: #2ABDCB;
        }
      }
    }
  }
}
</style>
