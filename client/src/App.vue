<template>
  <div>
    <loading ref="loading" />
    <a-config-provider>
      <component v-if="layout" :is="layout" />
    </a-config-provider>
  </div>
</template>

<script>
import Loading from '@/components/loading/Loading';
export default {
  computed: {
    layout() {
      return this.$route.meta.layout;
    },
  },
  components: {
    Loading,
  },
  mounted() {
    this.$loading = this.$refs.loading;
    document.onreadystatechange = () => {};
  },
};
</script>
