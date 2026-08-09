import { Injectable, Logger, ServiceUnavailableException } from "@nestjs/common";
import { randomBytes } from "node:crypto";
import type { Readable } from "node:stream";
import * as Minio from "minio";
import { env } from "../../config/env";
import { extractExtension } from "./upload-validation";

export type StorageStatus = "ok" | "error" | "not_configured";

const PRESIGN_PUT_TTL = 10 * 60; // 10 min
const PRESIGN_GET_TTL = 60 * 60; // 1 h

/** S3-kompatibler Object Storage (MinIO dev / S3 prod). */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: Minio.Client | null;

  constructor() {
    if (env.S3_ENDPOINT && env.S3_ACCESS_KEY && env.S3_SECRET_KEY) {
      this.client = new Minio.Client({
        endPoint: env.S3_ENDPOINT,
        port: env.S3_PORT,
        useSSL: env.S3_USE_SSL,
        accessKey: env.S3_ACCESS_KEY,
        secretKey: env.S3_SECRET_KEY,
        // Für Cloudflare R2: "auto"; für AWS die Ziel-Region.
        region: env.S3_REGION,
      });
    } else {
      this.client = null;
    }
  }

  isConfigured(): boolean {
    return this.client !== null;
  }

  private requireClient(): Minio.Client {
    if (!this.client) {
      throw new ServiceUnavailableException("Object Storage ist nicht konfiguriert.");
    }
    return this.client;
  }

  async checkReady(): Promise<StorageStatus> {
    if (!this.client) {
      return "not_configured";
    }
    try {
      await this.ensureBucket(env.S3_BUCKET);
      return "ok";
    } catch (error: unknown) {
      this.logger.warn(
        `Storage nicht erreichbar: ${error instanceof Error ? error.message : String(error)}`,
      );
      return "error";
    }
  }

  private async ensureBucket(bucket: string): Promise<void> {
    const client = this.requireClient();
    const exists = await client.bucketExists(bucket);
    if (exists) {
      return;
    }
    // Bei verwalteten Buckets (Cloudflare R2, S3) werden Buckets extern
    // angelegt; das API-Token darf oft keine Buckets erstellen.
    if (!env.S3_AUTO_CREATE_BUCKET) {
      throw new Error(
        `Bucket "${bucket}" fehlt (S3_AUTO_CREATE_BUCKET=false). Bitte extern anlegen.`,
      );
    }
    await client.makeBucket(bucket);
    this.logger.log(`Bucket "${bucket}" angelegt.`);
  }

  /** Zufaelliger, nicht erratbarer Storage-Key (nie der Originalname). */
  buildStorageKey(siteId: string, filename: string): string {
    const extension = extractExtension(filename);
    const random = randomBytes(16).toString("hex");
    const suffix = extension ? `.${extension}` : "";
    return `${siteId}/${random}${suffix}`;
  }

  async presignUpload(key: string): Promise<string> {
    const client = this.requireClient();
    await this.ensureBucket(env.S3_BUCKET);
    return client.presignedPutObject(env.S3_BUCKET, key, PRESIGN_PUT_TTL);
  }

  async presignDownload(key: string): Promise<string> {
    const client = this.requireClient();
    return client.presignedGetObject(env.S3_BUCKET, key, PRESIGN_GET_TTL);
  }

  /** Schreibt ein bereits serverseitig validiertes Objekt in den privaten Bucket. */
  async putObject(key: string, content: Buffer, mimeType: string): Promise<void> {
    const client = this.requireClient();
    await this.ensureBucket(env.S3_BUCKET);
    await client.putObject(env.S3_BUCKET, key, content, content.length, {
      "Content-Type": mimeType,
    });
  }

  /** Oeffnet ein Objekt als Stream; der Bucket bleibt fuer Clients unsichtbar. */
  async getObject(key: string): Promise<Readable> {
    return this.requireClient().getObject(env.S3_BUCKET, key);
  }

  async statObject(key: string): Promise<{ size: number } | null> {
    try {
      const stat = await this.requireClient().statObject(env.S3_BUCKET, key);
      return { size: stat.size };
    } catch {
      return null;
    }
  }

  /** Liest die ersten Bytes eines Objekts (fuer die Magic-Byte-Pruefung). */
  async readHeadBytes(key: string, length: number): Promise<Buffer> {
    const client = this.requireClient();
    const stream = await client.getPartialObject(env.S3_BUCKET, key, 0, length);
    const chunks: Buffer[] = [];
    return new Promise<Buffer>((resolve, reject) => {
      stream.on("data", (chunk: Buffer) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    });
  }

  async removeObject(key: string): Promise<void> {
    await this.requireClient().removeObject(env.S3_BUCKET, key);
  }
}
