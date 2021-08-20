import Vue from 'vue';
import Router from 'vue-router';
import ProgressBar from '@/components/loading/ProgressBar';
import store from '@/store';
import routes from './routes';

Vue.use(Router);

const router = createRouter();

const bar = (Vue.prototype.$bar = new Vue(ProgressBar).$mount());
document.body.appendChild(bar.$el);

function createRouter() {
  const router = new Router({
    scrollBehavior,
    mode: 'history',
    routes,
  });
  router.beforeEach(beforeEach);
  router.afterEach(afterEach);
  return router;
}

async function beforeEach(to, from, next) {
  bar.start();
  const middleware = to.meta.middleware;
  if (!middleware || !middleware[0]) {
    return next();
  }
  const context = {
    to,
    from,
    next,
    store,
  };
  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1),
  });
}

function middlewarePipeline(context, middleware, index) {
  const nextMiddleware = middleware[index];
  if (!nextMiddleware) {
    return context.next;
  }
  return () => {
    const nextPipeline = middlewarePipeline(context, middleware, index + 1);
    nextMiddleware({ ...context, next: nextPipeline });
  };
}

function afterEach() {
  bar.finish();
}

function scrollBehavior(to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition;
  }
  return {
    x: 0,
    y: 0,
    behavior: 'smooth',
  };
}

export default router;
