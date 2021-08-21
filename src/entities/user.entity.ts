import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import config from '@/config';
import { RoomEntity } from './room.entity';
import { UserRoomEntity } from './user-room.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    unique: true,
  })
  username: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column({
    name: 'full_name',
    nullable: true,
  })
  fullName: string;

  @Column('text')
  password: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @OneToMany(() => RoomEntity, (room) => room.host, { onDelete: 'CASCADE' })
  rooms: RoomEntity[];

  @OneToMany(() => UserRoomEntity, (userRoom) => userRoom.user, {
    onDelete: 'CASCADE',
  })
  userRooms: UserRoomEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async matchPassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  toResponse() {
    const { id, email, username, fullName, createdAt, updatedAt, token } = this;
    return {
      id,
      email,
      username,
      fullName,
      createdAt,
      updatedAt,
      token,
    };
  }

  private get token() {
    const { id, username, email } = this;
    return jwt.sign(
      {
        id,
        username,
        email,
      },
      config.app.appSecret,
      { expiresIn: '7d' },
    );
  }
}
