const roomStorage = {
  rooms: {},
  sessions: {},
  hasRoom(roomId) {
    return !!this.rooms[roomId];
  },
  addUserToRoom(roomId, user) {
    this.sessions[user.id] = user.socketId;
    if (!this.hasRoom(roomId)) {
      this.rooms[roomId] = [];
    }
    if (!this.isUserExistsInRoom(roomId, user.id)) {
      this.rooms[roomId].push(user);
    }
  },
  isUserExistsInRoom(roomId, userId) {
    if (this.hasRoom(roomId)) {
      return this.rooms[roomId].some((u) => u.id == userId);
    }
    return false;
  },
  userSession(userId) {
    return this.sessions[userId];
  },
};

export default roomStorage;
