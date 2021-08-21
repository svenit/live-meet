import axios from 'axios';
import store from '@/store/index';
import router from '@/router';
import { message } from 'ant-design-vue';
import config from '@/config';

const { apiUrl } = config.app;

axios.interceptors.request.use(async (request) => {
  request.baseURL = apiUrl;
  const token = store.getters['auth/tokenUser'];
  if (token) request.headers.common['Authorization'] = `Bearer ${token}`;
  if (request.data) {
    Object.keys(request.data).forEach((key) => {
      if (request.data[key] == '') {
        delete request.data[key];
      }
    });
  }
  return request;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error && error.response) {
      if (error.response.status == 401) {
        if (router.currentRoute.name != 'app.login') {
          store.dispatch('auth/logout');
          return router.push({ name: 'app.login', query: { refresh: false } });
        }
      }
      if (error.response.status == 429) {
        return message.error(error.response.data.message);
      }
    }
    return Promise.reject(error.response.data);
  },
);
