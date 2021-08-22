import { UserRepository, UserRoomRepository } from '@/repository';
import { RoomRepository } from '@/repository/room.repository';
import { RoomResponse } from '@/types/room.type';
import utilities from '@/utils/utilities';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoomDTO, GetRoomDTO } from './room.dto';

@Injectable()
export class RoomService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly roomRepo: RoomRepository,
    private readonly userRoomRepo: UserRoomRepository,
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

  async getRoom(data: GetRoomDTO): Promise<RoomResponse & any> {
    const { userId, roomId } = data;
    const room = await this.roomRepo.findOne({
      where: { roomId },
      relations: ['host', 'userRooms'],
    });
    if (!room || !room.host) {
      throw new HttpException('Can not found this room', HttpStatus.NOT_FOUND);
    }
    const isHost = room.host.id === userId;
    const isJoined = room.userRooms.some((user) => user.userId === userId);
    let isRequirePassword = !!room.password && !isHost;
    let isBanned = false;

    if (room.userRooms.length > 0) {
      isRequirePassword = !isJoined;
      isBanned = room.userRooms[0].isBanned && !isHost;
    }

    return {
      ...room.toResponse(),
      host: utilities.pickByKey(['id', 'fullName'], room.host),
      isHost,
      isRequirePassword,
      isBanned,
      isJoined,
    };
  }
}
