import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from '@/api/auth/auth.module';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { HttpErrorFilter } from './filters/httpError.filter';
@Module({
  imports: [UserModule, TypeOrmModule.forRoot()],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
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
      )
      .forRoutes('*');
  }
}
