export default async function auth({ store, next }) {
  if (store.getters['auth/isLogined']) {
    return next({
      name: 'app.index',
    });
  }
  await store.dispatch('auth/fetchUser');
  if (store.getters['auth/isLogined']) {
    return next({
      name: 'app.index',
    });
  }
  return next();
}
