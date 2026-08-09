import {
  ForbiddenException,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../../../common/decorators";
import type { RequestWithAuth } from "../../../common/request-context";
import { tokensMatch } from "../token.util";
import { CSRF_COOKIE, CSRF_HEADER } from "../cookies";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Double-Submit-CSRF: mutierende, authentifizierte Requests muessen den Wert
 * des (nicht-httpOnly) CSRF-Cookies im Header X-CSRF-Token wiederholen.
 * Public-Routen (Login, Reset, spaetere Public-API) sind ausgenommen und
 * anderweitig geschuetzt (Rate Limits, SameSite=Lax).
 */
@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    if (SAFE_METHODS.has(request.method)) {
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const cookieValue = (
      request.cookies as Record<string, string> | undefined
    )?.[CSRF_COOKIE];
    const headerValue = request.headers[CSRF_HEADER];

    if (
      !cookieValue ||
      typeof headerValue !== "string" ||
      !tokensMatch(cookieValue, headerValue)
    ) {
      throw new ForbiddenException("CSRF-Pruefung fehlgeschlagen.");
    }
    return true;
  }
}
