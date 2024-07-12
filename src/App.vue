<script setup></script>

<template>
  <!-- 添加路由组件 -->
  <!-- <router-view /> -->
  <!-- <router-view v-slot="{ Component }" v-if="$isHas('parent-sidebar')"> -->
  <router-view v-slot="{ Component }" v-if="true">
    <keep-alive
      include="HomeIndex,ContentIndex,TodayContent,BrowseTrack,GroundingHistory"
    >
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <div v-else class="no-permission">暂时无权限访问该资源，请联系管理员</div>
</template>
<script>
// import '../src/utils/csc-wxwork-sdk'
</script>
<style lang="scss">
@import './assets/styles/themeColor.scss';
@import './assets/styles/index.scss';
</style>
<style lang="scss">
// 处理主应用和改子应用的vant样式顺序不一致
.tabbar .van-tabbar--fixed {
  position: fixed;
  bottom: 0;
  left: 0;
}
body,
html,
#micro {
  width: 100%;
  height: 100%;
  height: 100vh !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f5f5f5;
  margin: 0 auto;
  max-width: 740px;
  -webkit-overflow-scrolling: touch;
}
#micro {
  position: relative;
}
.no-permission {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
