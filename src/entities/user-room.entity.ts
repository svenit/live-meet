import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

import { RoomEntity } from './room.entity';
import { UserEntity } from './user.entity';

@Entity('user_rooms')
export class UserRoomEntity {
  @Column({
    primary: true,
    name: 'user_id',
  })
  userId: number;

  @Column({
    primary: true,
    name: 'room_id',
  })
  roomId: number;

  @Column({
    name: 'is_banned',
    default: false,
  })
  isBanned: boolean;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.userRooms)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @ManyToOne(() => RoomEntity, (room) => room.userRooms)
  @JoinColumn({
    name: 'room_id',
  })
  room: RoomEntity;
}
