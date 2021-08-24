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

@WebSocketGateway(config.socket.port, config.socket.options)
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppGateway.name);

  afterInit() {
    this.logger.log('Gateway init');
  }

  @UseGuards(SocketGuard)
  handleConnection(socket: Socket) {
    try {
      this.logger.log('New client connected', socket.id);
      const { token } = socket.handshake.auth;
      if (isJWT(token) && jwt.verify(token, config.app.appSecret)) {
        return socket.emit('connection', socket.id);
      }
      this.logger.log('Failed to verify user');
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
  handleJoinRoom(socket: Socket, data) {
    const { roomId, userId } = data;
    this.logger.log('Client join room', roomId);
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
      this.logger.log('Client leave room', roomId);
    });
  }
}
