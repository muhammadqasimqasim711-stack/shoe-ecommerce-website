import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isStaffRole, roleHasPermission } from '../common/staff-roles';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: { role?: string } }>();
    const role = request.user?.role;
    if (!isStaffRole(role)) {
      throw new ForbiddenException('Admin access required');
    }

    const required = this.reflector.getAllAndOverride<string[] | undefined>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (required?.length) {
      const ok = required.some((p) => roleHasPermission(role, p));
      if (!ok) {
        throw new ForbiddenException('Insufficient permissions');
      }
    }
    return true;
  }
}
