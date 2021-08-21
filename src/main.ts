import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';
import { logger } from './middlewares';
import { ValidationPipe } from './pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  if (config.app.debug) {
    app.use(logger);
  }
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}

bootstrap();
