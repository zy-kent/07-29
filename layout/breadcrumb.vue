<template>
    <div class="breadcrumb-wrap breadcrumb-wrap-manage">
        <el-breadcrumb separator=">">
            <i class="icon-address"></i>
            <el-breadcrumb-item
                v-for="(item, index) in list"
                :key="index">{{ item.name }}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'

export default {
    data() {
        return {
            list: []
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
                this.initBreadcrumbList()
            },
            immediate: true
        }
    },
    methods: {
        initBreadcrumbList() {
            const path = this.$route.path
            this.list = []
            this.nav.currentNavList.forEach(item => {
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
                            this.list.push({
                                name: item.name
                            })
                            this.list.push({
                                name: subItem.name
                            })
                        }
                    } else {
                        subItem.subNav.forEach(thirdLevel => {
                            if (thirdLevel.link === path) {
                                this.list.push({
                                    name: item.name
                                })
                                this.list.push({
                                    name: subItem.name
                                })
                                this.list.push({
                                    name: thirdLevel.name
                                })
                            }
                        })
                    }
                })
            })
        }
    }
}
</script>

<style lang="less">
.breadcrumb-wrap-manage {
  display: inline-block;
  height: 50px;
  line-height: 50px;
  margin-left: 20px;
  vertical-align: middle;
  .el-breadcrumb {
    line-height: 50px;
    i {
      float: left;
      margin-right: 5px;
      color: #333333;
      vertical-align: middle;
      font-size: 16px;
    }
    span {
      color: #333333;
      cursor: text;
      font-weight: normal;
      &.el-breadcrumb__inner {
        font-weight: normal;
        color: #333333;
        &:hover {
          color: #333333;
        }
      }
    }
  }
}
.el-breadcrumb__item:first-child .el-breadcrumb__item__inner {
  cursor: default;
}
.el-breadcrumb__item:last-child .el-breadcrumb__item__inner, .el-breadcrumb__item:last-child .el-breadcrumb__item__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__item__inner a:hover, .el-breadcrumb__item:last-child .el-breadcrumb__item__inner:hover {
  color: #333333;
}
</style>
