import auth from '@/middlewares/auth';
import guest from '@/middlewares/guest';

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
        path: 'login',
        name: 'app.login',
        meta: {
          middleware: [guest],
          layout: 'Full',
        },
        component: page('login'),
      },
      {
        path: '',
        name: 'app.index',
        meta: {
          middleware: [auth],
          layout: 'Default',
        },
        component: page('index'),
      },
      {
        path: 'r/:id',
        name: 'app.room',
        meta: {
          middleware: [auth],
          layout: 'Full',
        },
        component: page('room'),
      },
      {
        path: '*',
        name: 'app.notfound',
        redirect: '/',
      },
    ],
  },
];
