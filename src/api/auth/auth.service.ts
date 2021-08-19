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
    if (!user || !user.matchPassword(password)) {
      throw new HttpException(
        'These credentials do not match our records.',
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
}
