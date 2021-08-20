import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from '@/api/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { AuthMiddleware } from './middlewares';
import { HttpErrorFilter } from './filters';
import { AppGateway } from './gateways/app.gateway';
@Module({
  imports: [UserModule, TypeOrmModule.forRoot()],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    AppGateway,
  ],
})
export class AppModule implements NestModule {
  configure(consumner: MiddlewareConsumer) {
    consumner
      .apply(AuthMiddleware)
      .exclude(
        {
          path: 'auth/login',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/signup',
          method: RequestMethod.POST,
        },
        {
          path: 'socket.io',
          method: RequestMethod.ALL,
        },
      )
      .forRoutes('*');
  }
}
