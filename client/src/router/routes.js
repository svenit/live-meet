const page = (path) => () =>
  import(`@/pages/${path}`).then((m) => m.default || m);

export default [
  {
    path: '/',
    component: {
      render(c) {
        return c('router-view');
      },
    },
    children: [
      {
        path: '',
        name: 'app.index',
        meta: {
          middleware: [],
          layout: 'Default',
        },
        component: page('login'),
      },
      {
        path: '404',
        meta: {
          middleware: [],
          layout: 'DefaultLayout',
          hiddenLayout: [],
        },
        component: page('not-found.vue'),
      },
      {
        path: '*',
        name: 'app.notfound',
        redirect: '/404',
      },
    ],
  },
];
