import { User } from '@/decorator';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRoomDTO } from './room.dto';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('create')
  createRoom(@User('id') userId: number, @Body() data: CreateRoomDTO) {
    return this.roomService.createRoom(userId, data);
  }
}
