import Vue from 'vue';

const requireComponent = require.context('./', false, /\.vue$/);
requireComponent
  .keys()
  .map((fileName) =>
    Vue.component(
      fileName.replace(/(^.\/)|(\.vue$)/g, ''),
      requireComponent(fileName).default,
    ),
  );
