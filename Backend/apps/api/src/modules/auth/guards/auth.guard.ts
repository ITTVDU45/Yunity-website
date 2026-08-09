import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../../../common/decorators";
import type { RequestWithAuth } from "../../../common/request-context";
import { UsersService } from "../../users/users.service";
import { AuthService } from "../auth.service";
import { SESSION_COOKIE } from "../cookies";

/** Validiert die Session aus dem httpOnly-Cookie und haengt den AuthContext an. */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    const token = (request.cookies as Record<string, string> | undefined)?.[
      SESSION_COOKIE
    ];
    if (!token) {
      throw new UnauthorizedException("Nicht angemeldet.");
    }

    const validated = await this.authService.validateSession(token);
    if (!validated) {
      throw new UnauthorizedException("Sitzung ist abgelaufen.");
    }

    const access = await this.usersService.resolveAccessFor(validated.user);
    request.auth = {
      user: validated.user,
      sessionId: validated.session._id.toString(),
      globalPermissions: access.globalPermissions,
      permissionsBySite: access.permissionsBySite,
    };
    return true;
  }
}
