import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGateWay } from './guards/auth.gateway';
import { logger } from './middlewares';
import { ValidationPipe } from './pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.use(logger);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new AuthGateWay(reflector));
  await app.listen(3000);
}

bootstrap();
