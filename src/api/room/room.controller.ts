import { User } from '@/decorator';
import roomStorage from '@/storage/room';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateRoomDTO } from './room.dto';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('create')
  createRoom(@User('id') userId: number, @Body() data: CreateRoomDTO) {
    return this.roomService.createRoom(userId, data);
  }

  @Get('owner')
  getOwnerRoom(@User('id') userId: number) {
    return this.roomService.getOwnerRoom(userId);
  }

  @Get('guest')
  getRoomGuest(@User('id') userId: number) {
    return this.roomService.getGuestRoom(userId);
  }

  @Get(':id')
  getRoom(@User('id') userId: number, @Param('id') roomId: string) {
    return this.roomService.getRoom({ userId, roomId });
  }

  @Get(':id/get-user-by-peer-id')
  getUserByPeerId(
    @Param('id') roomId: string,
    @Query('peerId') peerId: string,
  ) {
    const response = roomStorage.getUserFromRoom(roomId, peerId);
    if (response) {
      return {
        success: true,
        ...response,
      };
    }
  }

  @Get(':id/get-users-in-room')
  getUsersInRoom(@Param('id') roomId: string) {
    const users = roomStorage.getListUsersInRoom(roomId);
    if (users) {
      return {
        success: true,
        users,
      };
    }
  }

  @Post(':id/validate-password')
  validatePassword(
    @User('id') userId: number,
    @Param('id') roomId: string,
    @Body('password') password: string,
  ) {
    return this.roomService.validatePassword({ userId, roomId, password });
  }

  @Post(':id/join-room')
  insertIntoRoom(@User('id') userId: number, @Param('id') roomId: string) {
    return this.roomService.insertIntoRoom({ userId, roomId });
  }

  @Post(':id/join')
  joinRoom(@Param('id') roomId: string) {
    return this.roomService.joinRoom(roomId);
  }
}
