import { UserRepository } from '@/repository';
import { RoomRepository } from '@/repository/room.repository';
import { RoomResponse } from '@/types/room.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly roomRepo: RoomRepository,
  ) {}

  async getOwnedRooms(hostId: number): Promise<RoomResponse[]> {
    const rooms = await this.roomRepo.find({ where: { hostId } });
    return rooms;
  }

  async getJoinedRoom(userId: number): Promise<any> {
    return 1;
  }
}
