import { Public, User } from '@/decorator';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoginDTO, SingupDTO } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() data: LoginDTO) {
    return this.userService.login(data);
  }

  @Public()
  @Post('signup')
  async signup(@Body() data: SingupDTO) {
    return this.userService.signup(data);
  }

  @Get('me')
  me(@User() user) {
    return user;
  }
}
