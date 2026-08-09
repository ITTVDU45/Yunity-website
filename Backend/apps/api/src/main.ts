import "reflect-metadata";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/http-exception.filter";
import { TransformInterceptor } from "./common/transform.interceptor";
import { env, isProduction } from "./config/env";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const express = app.getHttpAdapter().getInstance();

  // Genau ein vertrauenswuerdiger Reverse Proxy (Caddy) steht vor der API.
  // Dadurch verwenden Rate-Limits und Audit-Logs die echte Client-IP.
  express.set("trust proxy", 1);
  app.enableShutdownHooks();

  app.setGlobalPrefix("api");
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: [env.ADMIN_URL],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle("CMS API")
      .setDescription("Headless-CMS — Admin- und Public-API")
      .setVersion("0.1.0")
      .addCookieAuth("cms_session")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);
  }

  await app.listen(env.PORT);
  new Logger("Bootstrap").log(
    `API laeuft auf http://localhost:${env.PORT}/api (Docs: /api/docs)`,
  );
}

void bootstrap();
