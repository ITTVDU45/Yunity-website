import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { map, type Observable } from "rxjs";

/**
 * Verpackt alle /api/v1-Antworten in das Erfolgs-Envelope
 * { success: true, data, meta? }. Health-Routen und Antworten mit einem bereits
 * gesetzten Nicht-JSON-Content-Type (z. B. CSV-Export) bleiben unveraendert.
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const contentType = response.getHeader("Content-Type");
    const isNonJson =
      typeof contentType === "string" &&
      !contentType.includes("application/json");
    if (!request.path.startsWith("/api/v1") || isNonJson) {
      return next.handle();
    }

    return next.handle().pipe(
      map((payload: unknown) => {
        if (
          typeof payload === "object" &&
          payload !== null &&
          "success" in payload
        ) {
          return payload;
        }
        if (
          typeof payload === "object" &&
          payload !== null &&
          "data" in payload &&
          "meta" in payload
        ) {
          const { data, meta } = payload as { data: unknown; meta: unknown };
          return { success: true, data, meta };
        }
        return { success: true, data: payload ?? null };
      }),
    );
  }
}
