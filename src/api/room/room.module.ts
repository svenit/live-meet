import { RoomRepository } from '@/repository';
import { UserRepository } from '@/repository/user.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, RoomRepository])],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
