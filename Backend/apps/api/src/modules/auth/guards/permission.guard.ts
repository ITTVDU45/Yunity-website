import {
  ForbiddenException,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { hasPermission, type PermissionKey } from "@yunity/permissions";
import { PERMISSION_KEY } from "../../../common/decorators";
import type { RequestWithAuth } from "../../../common/request-context";
import { SITE_COOKIE, SITE_HEADER } from "../cookies";

/**
 * Prueft @RequirePermission-Metadaten gegen die effektiven Rechte.
 * Site-Kontext: Header X-Site-Id; bei genau einer zugewiesenen Site
 * wird diese implizit verwendet. Globale Rechte (Super Admin) gelten immer.
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<
      PermissionKey | undefined
    >(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    if (!required) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    const auth = request.auth;
    if (!auth) {
      // AuthGuard laeuft vorher; ohne Kontext (z. B. @Public + @RequirePermission
      // falsch kombiniert) wird sicher verweigert.
      throw new ForbiddenException("Keine Berechtigung.");
    }

    if (hasPermission(auth.globalPermissions, required)) {
      return true;
    }

    const headerSiteId = request.headers[SITE_HEADER];
    const cookieSiteId = (
      request.cookies as Record<string, string> | undefined
    )?.[SITE_COOKIE];
    const siteIds = Object.keys(auth.permissionsBySite);
    const siteId =
      typeof headerSiteId === "string" && headerSiteId.length > 0
        ? headerSiteId
        : typeof cookieSiteId === "string" && cookieSiteId.length > 0
          ? cookieSiteId
        : siteIds.length === 1
          ? siteIds[0]
          : null;

    if (!siteId) {
      throw new ForbiddenException("Kein Site-Kontext gewaehlt.");
    }

    const granted = auth.permissionsBySite[siteId] ?? [];
    if (!hasPermission(granted, required)) {
      throw new ForbiddenException("Keine Berechtigung.");
    }
    return true;
  }
}
