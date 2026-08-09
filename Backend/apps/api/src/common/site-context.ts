import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
  createParamDecorator,
  type ExecutionContext,
} from "@nestjs/common";
import { SITE_COOKIE, SITE_HEADER } from "../modules/auth/cookies";
import type { RequestWithAuth } from "./request-context";

/**
 * Ermittelt die aktive Site fuer eine Admin-Anfrage.
 * Regeln (siehe docs/api-design.md §1):
 *  - Header X-Site-Id gesetzt: nur zulaessig, wenn der Benutzer global ("*")
 *    berechtigt ist oder die Site in seinen Zuweisungen enthaelt.
 *  - Kein Header: bei genau einer zugewiesenen Site wird diese verwendet.
 *  - Sonst (u. a. Super Admin ohne Auswahl): Fehler — die Auswahl ist Pflicht.
 * siteId stammt damit nie aus dem Request-Body (Schutz vor Site-ID-Manipulation).
 */
export function resolveActiveSiteId(request: RequestWithAuth): string {
  const auth = request.auth;
  if (!auth) {
    throw new UnauthorizedException("Nicht angemeldet.");
  }

  const header = request.headers[SITE_HEADER];
  const cookie = (request.cookies as Record<string, string> | undefined)?.[
    SITE_COOKIE
  ];
  const requestedSiteId =
    typeof header === "string" && header.length > 0
      ? header
      : typeof cookie === "string" && cookie.length > 0
        ? cookie
        : null;
  const assigned = Object.keys(auth.permissionsBySite);
  const isSuperAdmin = auth.globalPermissions.includes("*");

  if (requestedSiteId) {
    if (isSuperAdmin || assigned.includes(requestedSiteId)) {
      return requestedSiteId;
    }
    throw new ForbiddenException("Kein Zugriff auf diese Site.");
  }

  if (assigned.length === 1) {
    return assigned[0];
  }

  throw new BadRequestException(
    "Kein Site-Kontext gewaehlt (X-Site-Id oder Site-Cookie fehlt).",
  );
}

/** Injiziert die aufgeloeste aktive Site-Id in einen Controller-Parameter. */
export const ActiveSiteId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    return resolveActiveSiteId(request);
  },
);
