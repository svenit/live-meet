import { UserRepository } from '@/repository';
import { RoomRepository } from '@/repository/room.repository';
import { RoomResponse } from '@/types/room.type';
import utilities from '@/utils/utilities';
import { Injectable } from '@nestjs/common';
import { CreateRoomDTO } from './room.dto';

@Injectable()
export class RoomService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly roomRepo: RoomRepository,
  ) {}

  async createRoom(userId: number, data: CreateRoomDTO): Promise<RoomResponse> {
    const { name, password } = data;
    const roomId = utilities.strRandom(20);
    const room = this.roomRepo.create({
      name,
      password,
      userId,
      roomId,
      userRooms: [{ userId }],
    });
    await this.roomRepo.save(room);
    return room.toResponse();
  }
}
