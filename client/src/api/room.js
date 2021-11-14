import axios from "axios";

export default {
  create(params) {
    return axios.post("/room/create", params);
  },
  get(roomId) {
    return axios.get(`/room/${roomId}`);
  },
  getUserByPeerId({ peerId, roomId }) {
    return axios.get(`/room/${roomId}/get-user-by-peer-id`, {
      params: {
        peerId,
      },
    });
  },
  getUsersInRoom(roomId) {
    return axios.get(`/room/${roomId}/get-users-in-room`);
  },
  validatePassword({ roomId, password }) {
    return axios.post(`/room/${roomId}/validate-password`, {
      password,
    });
  },
  joinRoom({ roomId }) {
    return axios.post(`/room/${roomId}/join`);
  },
  getOwnerRoom() {
    return axios.get(`/room/owner`);
  },
  getRoomsGuest() {
    return axios.get(`/room/guest`);
  },
};
