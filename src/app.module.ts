import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumner: MiddlewareConsumer) {
    consumner
      .apply(AuthMiddleware)
      .exclude({
        path: 'auth/login',
        method: RequestMethod.POST,
      })
      .forRoutes('*');
  }
}
