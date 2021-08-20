import { Public, User } from '@/decorator';
import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { LoginDTO, SingupDTO } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @HttpCode(200)
  @Public()
  @Post('login')
  async login(@Body() data: LoginDTO) {
    return this.userService.login(data);
  }

  @HttpCode(201)
  @Public()
  @Post('signup')
  async signup(@Body() data: SingupDTO) {
    return this.userService.signup(data);
  }

  @HttpCode(200)
  @Get('me')
  me(@User() user) {
    return this.userService.getUser(user);
  }
}
