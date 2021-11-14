const roomStorage = {
  rooms: {},
  sessions: {},
  roomShareScreen: {},
  hasRoom(roomId: string) {
    return !!this.rooms[roomId];
  },
  addUserToRoom(roomId: string, user: any) {
    this.sessions[user.id] = user.socketId;
    if (!this.hasRoom(roomId)) {
      this.rooms[roomId] = [];
    }
    if (!this.isUserExistsInRoom(roomId, user.id)) {
      this.rooms[roomId].push(user);
    } else {
      const userIndex = this.rooms[roomId].findIndex((u) => u.id == user.id);
      if (userIndex != -1) {
        this.rooms[roomId][userIndex].userId = user.userId;
      }
    }
  },
  isUserExistsInRoom(roomId: string, userId: string) {
    if (this.hasRoom(roomId)) {
      return this.rooms[roomId].some((u: any) => u.id == userId);
    }
    return false;
  },
  userSession(userId: number) {
    return this.sessions[userId];
  },
  addUserShareScreen(roomId: string, userId: string) {
    if (!this.roomShareScreen[roomId]) this.roomShareScreen[roomId] = [];
    this.roomShareScreen[roomId].push(userId);
  },
  getUserShareScreen(roomId: string) {
    return this.roomShareScreen[roomId];
  },
  getUserFromRoom(roomId: string, userId: string) {
    if (this.hasRoom(roomId)) {
      return this.rooms[roomId].find((user) => user.userId == userId);
    }
  },
  getListUsersInRoom(roomId: string) {
    return this.rooms[roomId];
  },
  removeUserFromRoom(roomId: string, id) {
    if (this.hasRoom(roomId)) {
      const userIndex = this.rooms[roomId].findIndex((u: any) => u.id == id);
      if (userIndex != -1) {
        this.rooms[roomId].splice(userIndex, 1);
      }
    }
  },
};

export default roomStorage;
