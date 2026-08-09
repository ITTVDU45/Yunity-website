import {
  createParamDecorator,
  SetMetadata,
  type ExecutionContext,
} from "@nestjs/common";
import type { PermissionKey } from "@yunity/permissions";
import type { AuthContext, RequestWithAuth } from "./request-context";

export const IS_PUBLIC_KEY = "cms:isPublic";
/** Route ist ohne Session erreichbar (Login, Health, Public-API). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const PERMISSION_KEY = "cms:permission";
/** Route erfordert eine Berechtigung; Pruefung erfolgt serverseitig im Guard. */
export const RequirePermission = (permission: PermissionKey) =>
  SetMetadata(PERMISSION_KEY, permission);

/** Injiziert den authentifizierten Kontext (User, Berechtigungen, Session). */
export const CurrentAuth = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthContext => {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    if (!request.auth) {
      throw new Error(
        "CurrentAuth wurde auf einer Route ohne AuthGuard verwendet",
      );
    }
    return request.auth;
  },
);
