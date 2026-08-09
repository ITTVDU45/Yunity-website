import { BadRequestException } from "@nestjs/common";
import type { ArgumentsHost } from "@nestjs/common";
import { AllExceptionsFilter } from "./http-exception.filter";

function capture(exception: unknown) {
  let captured: { status: number; body: unknown } | undefined;
  const host = {
    switchToHttp: () => ({
      getResponse: () => ({
        status: (status: number) => ({
          json: (body: unknown) => {
            captured = { status, body };
          },
        }),
      }),
    }),
  } as unknown as ArgumentsHost;
  new AllExceptionsFilter().catch(exception, host);
  return captured;
}

describe("AllExceptionsFilter", () => {
  it("reicht Zod-Issues als details weiter", () => {
    const result = capture(
      new BadRequestException({
        message: "Attribute sind ungueltig.",
        issues: [{ path: "directPhone", message: "Zu lang" }],
      }),
    );

    expect(result?.status).toBe(400);
    expect(result?.body).toEqual({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Attribute sind ungueltig.",
        details: [{ field: "directPhone", message: "Zu lang" }],
      },
    });
  });

  it("laesst field weg, wenn der Pfad leer ist (unrecognized_keys)", () => {
    const result = capture(
      new BadRequestException({
        message: "Attribute sind ungueltig.",
        issues: [{ path: "", message: "Unrecognized key(s): 'imagePosition'" }],
      }),
    );

    expect(result?.body).toEqual({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Attribute sind ungueltig.",
        details: [{ message: "Unrecognized key(s): 'imagePosition'" }],
      },
    });
  });
});
