import * as path from "node:path";
import { readFileSync } from "node:fs";
import * as dotenv from "dotenv";
import { z } from "zod";

// .env-Aufloesung: erst App-lokal, dann CMS-Root (cms/.env).
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z
    .string()
    .min(1)
    .default("mongodb://localhost:27017/yunity-cms"),
  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET muss mindestens 32 Zeichen lang sein"),
  ADMIN_URL: z.string().url().default("http://localhost:4100"),
  COOKIE_SECURE: z
    .string()
    .default("false")
    .transform((value) => value === "true"),
  SCHEDULER_ENABLED: z
    .string()
    .default("true")
    .transform((value) => value === "true"),

  SUPERADMIN_EMAIL: z.string().email().optional(),
  SUPERADMIN_PASSWORD: z.string().min(12).optional(),

  S3_ENDPOINT: z.string().optional(),
  S3_PORT: z.coerce.number().int().positive().optional(),
  S3_USE_SSL: z
    .string()
    .default("false")
    .transform((value) => value === "true"),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  S3_BUCKET: z.string().default("cms-media"),
  S3_PRIVATE_BUCKET: z.string().default("cms-private"),
  // Region: AWS-Region bzw. "auto" für Cloudflare R2.
  S3_REGION: z.string().default("us-east-1"),
  // Bei R2/verwalteten Buckets: Buckets extern anlegen, nicht per API erstellen.
  S3_AUTO_CREATE_BUCKET: z
    .string()
    .default("true")
    .transform((value) => value === "true"),

  // E-Mail (Formular-Benachrichtigungen). Ohne Konfiguration: Logger-Stub.
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  MAIL_FROM: z.string().optional(),

  // Frontend-Revalidierung (Cache-Invalidierung nach Veröffentlichung).
  FRONTEND_URL: z.string().url().optional(),
  REVALIDATION_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

const FILE_BACKED_VARIABLES = [
  "MONGODB_URI",
  "SESSION_SECRET",
  "S3_ACCESS_KEY",
  "S3_SECRET_KEY",
  "SMTP_PASSWORD",
  "REVALIDATION_SECRET",
] as const;

function resolveFileBackedVariables(
  source: NodeJS.ProcessEnv,
): NodeJS.ProcessEnv {
  const resolved = { ...source };
  for (const key of FILE_BACKED_VARIABLES) {
    const filePath = source[`${key}_FILE`];
    if (resolved[key] || !filePath) {
      continue;
    }
    try {
      const value = readFileSync(filePath, "utf8").trim();
      if (!value) {
        throw new Error("Datei ist leer");
      }
      resolved[key] = value;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Secret-Datei fuer ${key} konnte nicht gelesen werden: ${message}`,
      );
    }
  }
  return resolved;
}

function loadEnv(): Env {
  const result = envSchema.safeParse(resolveFileBackedVariables(process.env));
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n  ");
    throw new Error(`Ungueltige Umgebungskonfiguration:\n  ${issues}`);
  }
  return result.data;
}

export const env = loadEnv();

export const isProduction = env.NODE_ENV === "production";
