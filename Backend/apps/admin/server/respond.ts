import { NextResponse } from "next/server"

/**
 * Einheitliches Antwortformat der CMS-API — identisch zur bisherigen NestJS-
 * Variante, damit der Client der Website unverändert bleibt.
 */
export function ok<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json({ success: true, data }, init)
}

export function fail(
  code: string,
  message: string,
  status: number,
  details?: unknown,
): NextResponse {
  return NextResponse.json(
    { success: false, error: { code, message, ...(details ? { details } : {}) } },
    { status },
  )
}

export const notFound = (message = "Nicht gefunden.") =>
  fail("NOT_FOUND", message, 404)

/**
 * Wandelt einen Fehler aus der Service-Schicht in eine Antwort. Die Services
 * werfen NestJS-HttpExceptions; deren `getStatus()` wird hier ausgewertet,
 * ohne NestJS zu importieren. Unbekannte Fehler werden geloggt und als 500
 * ohne Details ausgeliefert — Stacktraces gehören nicht in eine Antwort.
 */
export function fromError(error: unknown): NextResponse {
  const candidate = error as { getStatus?: () => number; message?: string }
  if (typeof candidate?.getStatus === "function") {
    const status = candidate.getStatus()
    const code =
      status === 404 ? "NOT_FOUND" : status === 409 ? "CONFLICT" : "BAD_REQUEST"
    return fail(code, candidate.message ?? "Fehlerhafte Anfrage.", status)
  }
  console.error("[cms-api]", error)
  return fail("INTERNAL", "Unerwarteter Fehler.", 500)
}

/** Nimmt jedem Handler das try/catch ab. */
export async function handle(
  fn: () => Promise<NextResponse>,
): Promise<NextResponse> {
  try {
    return await fn()
  } catch (error) {
    return fromError(error)
  }
}
