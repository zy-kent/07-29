<template>
    <div class="login-info login-info-manage">
        <!-- <div class="link-button">
            <el-tooltip
                class="manage-tips"
                effect="dark"
                content="返回前台"
                placement="bottom">
                <router-link to="/mgba"><i class="icon-houtai"></i></router-link>
            </el-tooltip>
        </div> -->
        <div class="login-info-wrap">
            <div class="avatar"><i class="icon-User"></i></div>
            <div class="user-info"><span>{{ userName }}</span><i class="icon-xiala"></i></div>
            <div class="logout-btn">
                <button @click="logoutHandler"><i class="icon-Signout"></i>退出</button>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import { getLogout } from '@/utils/api.js'

export default {
    props: {
        lineColor: {
            type: String,
            default: 'black-line'
        }
    },
    data() {
        return {
            userName: localStorage.getItem('bvreportUserName'),
            newNoticeClass: ''
        }
    },
    computed: {
        ...mapState({
            getSsoStatus: 'refresh'
        })
    },
    created() {
    },
    methods: {
        logoutHandler() {
            getLogout().then(res => {
                if (res.rspcode === 0) {
                    localStorage.removeItem('bvreportPhoneNum')
                    localStorage.removeItem('bvreportToken')
                    localStorage.removeItem('bvreportUserName')
                    localStorage.removeItem('unifiedUserId')
                    setTimeout(() => {
                        this.$router.replace({
                            name: 'login'
                        })
                    }, 500)
                } else {
                    this.$message({
                        type: 'error',
                        message: res.rspdesc
                    })
                }
            })
        }
    }
}
</script>

<style lang="less">
.login-info.login-info-manage {
  position: absolute;
  right: 20px;
  top: 15px;
  padding: 5px 0px 5px 50px;
  .link-button {
    display: inline-block;
    vertical-align: middle;
    a {
      text-decoration: none;
      color: #fff;
      font-size: 14px;
      margin-right: 10px;
    }
  }
  .login-info-wrap {
    display: inline-block;
    height: 40px;
    &:hover {
      .logout-btn {
        display: block;
      }
    }
  }
  .user-info {
    display: inline-block;
    vertical-align: middle;
    span {
      font-size: 14px;
      color: #fff;
    }
    i {
      display: inline-block;
      margin-left: 4px;
      vertical-align: middle;
      font-size: 16px;
      color: #fff;
    }
  }
  .avatar {
    display: inline-block;
    width: 18px;
    height: 18px;
    overflow: hidden;
    border-radius: 50%;
    vertical-align: middle;
    color: #fff;
  }
  .logout-btn {
    position: absolute;
    top: 28px;
    right: 0px;
    z-index: 1;
    display: none;
    padding: 10px 0px;
    border-radius: 4px;
    font-size: 14px;
    vertical-align: top;
    background: #fff;
    overflow: hidden;
    button {
      display: block;
      width: 100px;
      height: 34px;
      line-height: 30px;
      padding: 0px 10px;
      background: none;
      color: #333333;
      border: none;
      cursor: pointer;
      text-align: left;
      &:hover {
        background: #eefaf8;
      }
      i {
        font-size: 12px;
        margin-right: 5px;
        vertical-align: top;
      }
    }
  }
}
</style>
