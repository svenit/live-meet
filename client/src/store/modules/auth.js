export const state = {
  user: {},
  isLogined: false,
  tokenUser: localStorage.getItem('token') || null,
  permissions: [],
  canResendEmailAfter: null,
};

export const getters = {
  user: (state) => state.user,
  isLogined: (state) => state.isLogined,
  tokenUser: (state) => state.tokenUser,
};

export const mutations = {};

export const actions = {};
