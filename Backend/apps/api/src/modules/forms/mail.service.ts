import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { env } from "../../config/env";

export interface MailMessage {
  to: string[];
  subject: string;
  text: string;
}

/**
 * Versendet E-Mails ueber SMTP. Ohne SMTP-Konfiguration wird der Versand nur
 * protokolliert (Stub) — konsistent mit dem Passwort-Reset in der Auth.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter | null;

  constructor() {
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT ?? 587,
        secure: (env.SMTP_PORT ?? 587) === 465,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
      });
    } else {
      this.transporter = null;
    }
  }

  isConfigured(): boolean {
    return this.transporter !== null;
  }

  /** Fehler beim Versand duerfen den Hauptvorgang (Submission) nicht abbrechen. */
  async send(message: MailMessage): Promise<void> {
    if (message.to.length === 0) {
      return;
    }
    if (!this.transporter) {
      this.logger.log(
        `E-Mail (Stub, kein SMTP): an ${message.to.join(", ")} — "${message.subject}"`,
      );
      return;
    }
    try {
      await this.transporter.sendMail({
        from: env.MAIL_FROM ?? env.SMTP_USER,
        to: message.to.join(", "),
        subject: message.subject,
        text: message.text,
      });
    } catch (error: unknown) {
      this.logger.error(
        `E-Mail-Versand fehlgeschlagen: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
