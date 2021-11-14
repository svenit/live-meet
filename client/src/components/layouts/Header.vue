<template>
  <div class="main-page-nav">
    <div class="layout-container m-auto d-flex justify-content-between">
      <div>
        <a-tabs :default-active-key="current">
          <a-tab-pane key="home" tab="Home"> </a-tab-pane>
          <a-tab-pane key="feedback" tab="Feedback"> </a-tab-pane>
        </a-tabs>
      </div>
      <div class="d-flex align-items-center">
        <a-tabs>
          <a-tab-pane key="settings">
            <span slot="tab">
              <a-icon type="setting" />
              Settings
            </span>
          </a-tab-pane>
        </a-tabs>
        <a-dropdown :trigger="['click']">
          <a-menu slot="overlay">
            <a-menu-item key="1"> {{ user.fullName }} </a-menu-item>
            <a-menu-item @click="logout" key="2"> <a-icon type="logout" /> Logout </a-menu-item>
          </a-menu>
          <a-avatar class="ml-3">{{ user.fullName ? user.fullName[0] : 'U' }}</a-avatar>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      current: 'home',
    };
  },
  computed: {
    ...mapState('auth', {
      user: (state) => state.user,
    }),
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
      this.$router.push({name: 'app.login'})
    }
  }
};
</script>
<style scoped>
.main-page-nav .ant-menu-horizontal {
  border: 0px !important;
}
.main-page-nav >>> .anticon {
  position: relative;
  top: -3px;
}
.main-page-nav >>> .ant-tabs-bar {
  margin: auto !important;
  border-color: #fff;
}
.main-page-nav >>> .ant-tabs-tab {
  font-size: 14px;
  color: #7a7b7c;
}
</style>
