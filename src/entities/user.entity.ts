import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import config from '@/config';

@Entity('user')
@Unique(['email', 'username'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  fullName: string;

  @Column('text')
  password: string;

  @CreateDateColumn()
  createdAt: any;

  @UpdateDateColumn()
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
