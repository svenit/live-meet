import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';
import { logger } from './middlewares';
import { ValidationPipe } from './pipes';
import { ExpressPeerServer } from 'peer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  if (config.app.debug) {
    app.use(logger);
  }
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  const peerServer = ExpressPeerServer(app.getHttpServer());
  app.use('/peerjs', peerServer);

  await app.listen(3000);
}

bootstrap();
