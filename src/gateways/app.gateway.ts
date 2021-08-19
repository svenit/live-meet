import { SocketGuard } from '@/guards/socket.guard';
import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: any;

  private readonly logger = new Logger(AppGateway.name);

  afterInit() {
    this.logger.log('Gateway init');
  }

  @UseGuards(SocketGuard)
  handleConnection(client: any) {
    this.logger.log('New client connected', client.id);
    client.emit('connection', 'Successfully connected to server');
  }

  handleDisconnect(client: any) {
    this.logger.log('Client disconnected', client.id);
  }
}
