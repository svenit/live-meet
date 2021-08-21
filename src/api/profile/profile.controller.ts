import { User } from '@/decorator';
import { Controller, Get } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('rooms')
  getOwnedRooms(@User('id') userId: number) {
    return this.profileService.getOwnedRooms(userId);
  }
}
