import axios from 'axios';

export default {
  create(params) {
    return axios.post('/room/create', params);
  },
  get(roomId) {
    return axios.get(`/room/${roomId}`);
  },
};
