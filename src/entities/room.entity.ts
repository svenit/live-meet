import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoomEntity } from './user-room.entity';
import { UserEntity } from './user.entity';

@Entity('rooms')
export class RoomEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({
    unique: true,
    name: 'room_id',
  })
  roomId: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
    name: 'host_id',
  })
  hostId: number;

  @Column('text')
  password: string;

  @Column({
    name: 'is_active',
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (host) => host.rooms, { nullable: true })
  @JoinColumn({ name: 'host_id' })
  host: UserEntity;

  @OneToMany(() => UserRoomEntity, (userRoom) => userRoom.room, {
    onDelete: 'CASCADE',
  })
  userRooms: UserEntity[];

  toResponse() {
    return 1;
  }
}
