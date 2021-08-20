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

@WebSocketGateway(3000, {
  cors: {
    origin: false,
  },
  cookie: {
    httpOnly: true,
    path: '/',
  },
  maxHttpBufferSize: 1e6,
})
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
  handleConnection(client: Socket) {
    this.logger.log('New client connected', client.id);
    client.emit('connection', 'Successfully connected to server');
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected', client.id);
  }
}
