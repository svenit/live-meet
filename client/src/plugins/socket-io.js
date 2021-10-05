import io from "socket.io-client";
import config from "@/config";
import store from "@/store/index";

const Socket = {
  socketInstance: null,
  createConnection() {
    if (this.socketInstance) {
      return this;
    }
    const token = store.getters["auth/tokenUser"];
    this.socketInstance = io(config.socket.host, {
      extraHeaders: {
        token,
      },
      auth: {
        token,
      },
    });
    return this;
  },
  instance() {
    return this.socketInstance;
  },
  onConnected(callback) {
    this.on("connection", callback);
  },
  onDisconnected(callback) {
    this.on("disconnect", callback);
  },
  reconnect() {
    console.info("Reconnect socket...");
    this.socketInstance.connect();
  },
  on(channel, callback) {
    this.socketInstance.on(channel, callback);
  },
  emit(channel, data = null) {
    this.socketInstance.emit(channel, data);
  },
  terminate() {
    console.log("Terminated socket");
    this.emit("terminate");
  },
};

export default Socket;
