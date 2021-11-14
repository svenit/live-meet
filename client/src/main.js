import Vue from "vue";
import App from "@/App";
import router from "@/router";
import store from "@/store";

import "@/layouts";
import "@/plugins";

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  store,
  router,
  ...App,
});
