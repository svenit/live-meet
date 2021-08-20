<template>
  <div id="master-layout" class="slide-fade-enter-active">
    <transition>
      <router-view :key="$route.fullPath" />
    </transition>
  </div>
</template>
<style scoped>
body {
  margin: 0;
  color: #444e60;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  font-variant: tabular-nums;
  line-height: 1.5715;
  background-color: #fff;
  font-feature-settings: 'tnum';
}
</style>
