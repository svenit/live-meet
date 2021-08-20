<template>
  <loading-inside v-if="visible" />
</template>
<script>
import LoadingInside from './LoadingInside';

export default {
  data: () => ({
    visible: false,
  }),
  methods: {
    start() {
      this.visible = true;
    },
    finish() {
      this.visible = false;
    },
  },
  components: {
    LoadingInside,
  },
};
</script>

<style scoped>
.block {
  position: fixed;
  height: 100%;
  width: 100%;
  background: rgb(0, 0, 0, 0.4);
  z-index: 99999;
}
</style>
