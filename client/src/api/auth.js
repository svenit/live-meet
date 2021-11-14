import axios from "axios";

export default {
  login(params) {
    return axios.post("/auth/login", params);
  },
  signup(params) {
    return axios.post("/auth/signup", params);
  },
  fetchUser() {
    return axios.get("/auth/me");
  },
};
