<template>
    <footer class="footer">
        <p :class="color">
            &copy; {{ year }} 咪咕文化科技有限公司 版权所有
        </p>
    </footer>
</template>

<script type="text/ecmascript-6">
export default {
    props: {
        color: {
            type: String,
            default: 'black'
        }
    },
    computed: {
        year() {
            return new Date().getFullYear()
        }
    }
}
</script>

<style lang="less">
.footer {
  position: relative;
  height: 60px;
  line-height: 60px;
  margin: -60px 0px 0px 220px;
  p {
    margin: 0;
    text-align: center;
    font-size: 14px;
    &.white {
      color: #fff;
      a {
        color: #fff;
      }
    }
    &.black {
      color: #60687b;
      a {
        color: #60687b;
      }
    }
    &.indexPageColor {
      color: #9E9FF8;
      a {
        color: #9E9FF8;
      }
    }
  }
}
</style>
