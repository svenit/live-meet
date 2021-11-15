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
      password: password ?? null,
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

    if (room.userRooms.length > 0 && isRequirePassword) {
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

  async validatePassword({ userId, roomId, password }) {
    const room = await this.roomRepo.findOne({
      where: { roomId },
    });
    if (!room) {
      throw new HttpException('Can not found this room', HttpStatus.NOT_FOUND);
    }
    if (room.password == password) {
      return {
        success: true,
      };
    }
  }

  async insertIntoRoom({ userId, roomId }) {
    try {
      const userRoomExists = await this.userRoomRepo.findOne({
        userId,
        roomId,
      });
      if (!userRoomExists) {
        const userRoom = this.userRoomRepo.create({
          userId,
          roomId,
        });
        return this.userRoomRepo.save(userRoom);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async joinRoom(roomId: string) {
    const room = await this.roomRepo.findOne({
      where: { roomId },
    });
    return {
      success: !!room,
    };
  }

  async getOwnerRoom(userId) {
    const rooms = await this.roomRepo.find({
      take: 5,
      where: { userId },
    });
    return {
      success: true,
      rooms: rooms.reverse().map((room) => room.toResponse()),
    };
  }

  async getGuestRoom(userId) {
    const rooms = await this.userRoomRepo.find({
      take: 5,
      where: { userId },
      relations: ['user', 'room'],
    });
    return {
      success: true,
      rooms,
    };
  }
}
