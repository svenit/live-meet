import axios from 'axios';

export default {
  create(params) {
    return axios.post('/room/create', params);
  },
};
