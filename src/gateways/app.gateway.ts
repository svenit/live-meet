import config from '@/config';
import { SocketGuard } from '@/guards';
import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { isJWT } from 'class-validator';
import roomStorage from '@/storage/room';
import { UserRepository } from '@/repository';
@WebSocketGateway(config.socket.port, config.socket.options)
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly userRepo: UserRepository) {}

  private readonly logger = new Logger(AppGateway.name);

  afterInit() {
    this.logger.log('Gateway init');
  }

  @UseGuards(SocketGuard)
  handleConnection(socket: Socket) {
    try {
      const { token } = socket.handshake.auth;
      if (isJWT(token) && jwt.verify(token, config.app.appSecret)) {
        return socket.emit('connection', socket.id);
      }
      socket.disconnect();
    } catch (e) {
      this.logger.log(e.message);
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    this.logger.log('Client disconnected', socket.id);
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(socket: Socket, data) {
    const { roomId, userId, tokenUser, userConfig } = data;
    const userPayload: any = jwt.verify(tokenUser, config.app.appSecret);
    if (!userPayload.id) {
      return socket.disconnect();
    }
    const user = await this.userRepo.findOne(userPayload.id);
    if (!user) {
      return socket.disconnect();
    }
    const { id, fullName } = user.toResponse();
    /** Disconnect current session if exists */
    const currentSessionId = roomStorage.userSession(id);
    if (currentSessionId) {
      if (this.server.sockets.sockets.get(currentSessionId)) {
        this.server.sockets.sockets.get(currentSessionId).disconnect();
      }
    }
    /** Add user to room storage */
    roomStorage.addUserToRoom(roomId, {
      socketId: socket.id,
      id,
      userId,
      fullName,
      config: userConfig,
      time: new Date().getTime(),
    });
    socket.join([roomId, id]);
    socket.to(roomId).emit('user-connected', {
      userId,
      fullName,
    });
    socket.on('disconnect', () => {
      roomStorage.removeUserFromRoom(roomId, id);
      socket.to(roomId).emit('user-disconnected', {
        userId,
        fullName,
      });
    });
  }

  @SubscribeMessage('user-turn-off-camera')
  async handleTurnOffCamera(socket: Socket, data) {
    const { roomId, userId } = data;
    socket.to(roomId).emit('on-user-turn-off-camera', userId);
  }

  @SubscribeMessage('user-share-screen')
  async handleShareScreen(socket: Socket, data) {
    const { roomId, userId } = data;
    roomStorage.addUserShareScreen(roomId, userId);
    const user = roomStorage.getUserFromRoom(roomId, userId);
    socket.to(roomId).emit('on-user-share-screen', {
      userId,
      listUsersShareScreen: roomStorage.getUserShareScreen(roomId),
      user,
    });
  }

  @SubscribeMessage('user-stop-share-screen')
  async handleStopShareScreen(socket: Socket, data) {
    const { roomId, userId } = data;
    const user = roomStorage.getUserFromRoom(roomId, userId);
    socket.to(roomId).emit('on-user-stop-share-screen', {
      userId,
      user,
    });
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(socket: Socket, data) {
    const { roomId } = data;
    socket.in(roomId).emit('on-user-send-message', data);
  }
}
