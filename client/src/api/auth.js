import axios from "axios";

export default {
  login(params) {
    return axios.post("/auth/login", params);
  },
  fetchUser() {
    return axios.get("/auth/me");
  },
};
