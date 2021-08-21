import { UserEntity } from '@/entities';
import { UserRepository } from '@/repository';
import { UserResponse } from '@/types';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDTO, SingupDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  async login(data: LoginDTO): Promise<UserResponse> {
    const { username, password } = data;
    const user = await this.userRepo.findByUserName(username);
    if (!user || !(await user.matchPassword(password))) {
      throw new HttpException(
        'Username or password is incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user.toResponse();
  }

  async signup(data: SingupDTO): Promise<UserResponse> {
    const { username, email } = data;
    const isUserExists = await this.userRepo.exists({ username, email });
    if (isUserExists) {
      throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
    }
    const user = this.userRepo.create(data);
    await this.userRepo.save(user);
    return user.toResponse();
  }

  async getUser(data: Partial<UserEntity>): Promise<UserResponse> {
    const { id } = data;
    const user = await this.userRepo.findOne(id);
    if (!user) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
    return user.toResponse();
  }
}
