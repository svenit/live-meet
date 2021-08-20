<template>
  <div id="master-layout" class="slide-fade-enter-active">
    <transition>
      <router-view :key="$route.fullPath" />
    </transition>
  </div>
</template>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
