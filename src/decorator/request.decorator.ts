import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const BodyAndParam = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const { body, params } = ctx.switchToHttp().getRequest();
    return { body, params };
  },
);
