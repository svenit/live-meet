import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import config from '@/config';

@Entity('user')
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
    name: 'full_name',
    nullable: true,
  })
  fullName: string;

  @Column('text')
  password: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: any;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: any;

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
