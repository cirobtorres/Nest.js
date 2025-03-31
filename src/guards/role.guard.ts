import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { ROLES_KEYS } from "../decorators/role.decorator";
import { Role } from "../enums/role.enum";
import { UserService } from "../user/user.service";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Role>(ROLES_KEYS, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const filteredRoles = Object.values(requiredRoles).filter(
      (roleValue) => roleValue === user.role
    );
    return filteredRoles.length > 0;
  }
}
