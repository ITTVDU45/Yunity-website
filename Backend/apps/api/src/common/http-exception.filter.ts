import {
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
} from "@nestjs/common";
import type { Response } from "express";
import type { ApiError } from "@yunity/contracts";
import { isProduction } from "../config/env";

const CODE_BY_STATUS: Record<number, ApiError["code"]> = {
  [HttpStatus.BAD_REQUEST]: "VALIDATION_ERROR",
  [HttpStatus.UNPROCESSABLE_ENTITY]: "VALIDATION_ERROR",
  [HttpStatus.UNAUTHORIZED]: "UNAUTHORIZED",
  [HttpStatus.FORBIDDEN]: "FORBIDDEN",
  [HttpStatus.NOT_FOUND]: "NOT_FOUND",
  [HttpStatus.CONFLICT]: "CONFLICT",
  [HttpStatus.TOO_MANY_REQUESTS]: "RATE_LIMITED",
};

/** Einheitliches Fehlerformat: { success: false, error: { code, message, details } } */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Interner Serverfehler";
    let details: ApiError["details"];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === "string") {
        message = body;
      } else if (typeof body === "object" && body !== null) {
        const record = body as Record<string, unknown>;
        // ValidationPipe liefert message als string[].
        if (Array.isArray(record.message)) {
          message = "Validierung fehlgeschlagen";
          details = record.message.map((entry) => ({
            message: String(entry),
          }));
        } else if (typeof record.message === "string") {
          message = record.message;
        }
        // Zod-Issues (z. B. aus validateAttributes) gingen sonst verloren — ohne
        // Feldnamen ist "Attribute sind ungueltig." im Backend nicht behebbar.
        if (Array.isArray(record.issues)) {
          details = record.issues.map((entry) => {
            const issue = entry as { path?: unknown; message?: unknown };
            return {
              ...(typeof issue.path === "string" && issue.path
                ? { field: issue.path }
                : {}),
              message: String(issue.message ?? "Ungueltiger Wert"),
            };
          });
        }
      }
    } else {
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
      if (!isProduction && exception instanceof Error) {
        message = exception.message;
      }
    }

    const error: ApiError = {
      code: CODE_BY_STATUS[status] ?? "INTERNAL",
      message,
      ...(details ? { details } : {}),
    };

    response.status(status).json({ success: false, error });
  }
}
