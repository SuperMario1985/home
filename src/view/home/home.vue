<template>
  <div class="home">
    <h3 class="title">用于调试用的页面</h3>
    <div class="content">
      内容区域
    </div>
    <div class="footer">
      <a href="https://beian.miit.gov.cn">津ICP备2024014881号-2</a>
    </div>
  </div>
</template>
<script>
</script>
<style lang="scss" scoped>
.home{
  height: 100%;
  display: flex;
  flex-direction: column;
  .title{
  padding-top: 30px;
    text-align: center;
  }
  .content{
    flex: 1;
  }
  .footer{
    font-size: 13px;
    text-align: center;
    padding-bottom: 40px;
    a{
      color: #bbb;
    }
  }
}
</style>