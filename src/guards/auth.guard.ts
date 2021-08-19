import config from '@/config';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest();
    if (!request.headers?.authorization) {
      return false;
    }
    request.user = await this.validateToken(request);
    return true;
  }

  async validateToken(request: Request | any) {
    const [authType, jwtToken] = request.headers.authorization.split(' ');
    if (authType !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
    try {
      const decodedToken = jwt.verify(jwtToken, config.app.appSecret);
      return decodedToken;
    } catch (err) {
      throw new HttpException(
        'Token expired or does not exists',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
