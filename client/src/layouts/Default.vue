<template>
  <div id="master-layout">
    <Header />
    <div class="content-page">
      <router-view :key="$route.fullPath" />
    </div>
  </div>
</template>
<script>
import Header from '@/components/layouts/Header';
export default {
  components: {
    Header,
  },
};
</script>
<style>
.content-page {
  background: #f3f6f9 !important;
  min-height: calc(100vh - 46px);
}
.layout-container {
  width: 960px;
  margin: 0 auto;
  height: 100%;
}
</style>
