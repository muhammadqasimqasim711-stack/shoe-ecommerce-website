import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type AuthPayload = { sub: string; email: string; role: string };

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthPayload | undefined => {
    const request = ctx.switchToHttp().getRequest<{ user?: AuthPayload }>();
    return request.user;
  },
);
