import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpErrorFilter } from './filters';
import { AppGateway } from './gateways/app.gateway';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ProfileModule } from './api/profile/profile.module';
import { AuthModule } from './api/auth/auth.module';
import { UserRepository } from './repository';
import { AuthGuard } from './guards';
import { RoomModule } from './api/room/room.module';
@Module({
  imports: [
    AuthModule,
    ProfileModule,
    RoomModule,
    /* Third Party Modules */
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([UserRepository]),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 60,
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppGateway,
  ],
})
export class AppModule {}
