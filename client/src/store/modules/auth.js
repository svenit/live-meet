import api from '@/api';

export const state = {
  user: {},
  isLogined: false,
  tokenUser: localStorage.getItem('token') || null,
};

export const getters = {
  user: (state) => state.user,
  isLogined: (state) => state.isLogined,
  tokenUser: (state) => state.tokenUser,
};

export const mutations = {
  setAuth(state, res) {
    state.user = res;
    state.isLogined = true;
    localStorage.setItem('token', res.token);
  },
  logout(state) {
    state.user = null;
    state.isLogined = false;
    localStorage.removeItem('token');
  },
};

export const actions = {
  async login({ commit }, params) {
    const { data } = await api.auth.login(params);
    commit('setAuth', data);
    return data;
  },
  async fetchUser({ commit }) {
    try {
      const { data } = await api.auth.fetchUser();
      commit('setAuth', data);
    } catch (e) {}
  },
  async signup({ commit }, params) {
    const { data } = await api.auth.signup(params);
    commit('setAuth', data);
    return data;
  },
  logout({ commit }) {
    commit('logout');
  },
};
