import { RoomRepository } from '@/repository';
import { UserRepository } from '@/repository/user.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, RoomRepository])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
