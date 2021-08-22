<template>
  <div>OK</div>
</template>
<script>
import api from '@/api';
export default {
  data() {
    return {
      isFetching: false,
    };
  },
  async created() {
    this.$root.$loading.start();
    await this.fetchRoom();
    this.$root.$loading.finish();
  },
  methods: {
    async fetchRoom() {
      try {
        const roomId = this.$route.params.id;
        const { data } = await api.room.get(roomId);
      } catch (e) {
        this.$message.error(e.message);
        this.$router.push({ name: 'app.index' });
      }
    },
  },
};
</script>
