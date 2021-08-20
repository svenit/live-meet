import config from '@/config';
import { SocketGuard } from '@/guards';
import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
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
        return socket.emit('connection', 'Successfully connected to server');
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
}
