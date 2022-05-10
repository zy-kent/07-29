<template>
  <div>
    <p class="ft-12">
      网站域名：目前仅支持DNS域名系统，格式实例
      <span class="important-info">www.baidu.com</span>
    </p>
    <p class="ft-12">
      网站入口：请至少输入一条数据，格式实例
      <span class="important-info">/user</span>或
      <span class="important-info">/</span>（代表全部匹配）
    </p>
    <p class="ft-12">
      服务器IP: IP地址+端口号，支持独立IP设置和连续IP设置,
      独立IP
      <span class="important-info">114.114.114.114:8080</span>
      <br />连续IP
      <span class="important-info">114.114.114.100-110:8080</span>
    </p>
  </div>
</template>

<script>
export default {
    name: 'Form-Info'
};
</script>

<style lang="less" scoped>
.form-help {
    cursor: pointer;
    display: inline-block;
    margin-left: 12px;
    color: #409eff;
}
.important-info {
    display: inline-block;
    padding: 0 6px;
    color: red;
}
.ft-12 {
    font-size: 12px;
}
</style>
