import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import type { Request } from "express";
import type { PublicFormDefinition } from "@yunity/contracts";
import { Public } from "../../common/decorators";
import { PublicSiteResolver } from "../public/public-site.resolver";
import { FormsService } from "../forms/forms.service";
import { SubmissionsService } from "../forms/submissions.service";
import { SubmitFormDto } from "../forms/dto";
import { resolveContentLocale } from "../../common/locales";

@Controller("v1/public/forms")
export class PublicFormsController {
  constructor(
    private readonly siteResolver: PublicSiteResolver,
    private readonly formsService: FormsService,
    private readonly submissionsService: SubmissionsService,
  ) {}

  @Public()
  @Get(":key")
  async definition(
    @Req() request: Request,
    @Param("key") key: string,
    @Query("locale") localeParam?: string,
  ): Promise<PublicFormDefinition> {
    const site = await this.siteResolver.resolve(request);
    const form = await this.formsService.getByKeyActive(
      site._id.toString(),
      key,
    );
    if (!form) {
      throw new NotFoundException("Formular nicht gefunden.");
    }
    const locale = resolveContentLocale(
      localeParam,
      site.defaultLocale,
      site.enabledLocales,
    );
    return this.formsService.toPublicDefinition(form, locale, site.defaultLocale);
  }

  @Public()
  @Post(":key/submissions")
  // Spam-/Missbrauchsschutz: 5 Uebermittlungen pro 10 Minuten je IP.
  @Throttle({ default: { limit: 5, ttl: 10 * 60 * 1000 } })
  async submit(
    @Req() request: Request,
    @Param("key") key: string,
    @Body() dto: SubmitFormDto,
  ) {
    const site = await this.siteResolver.resolve(request);
    const form = await this.formsService.getByKeyActive(
      site._id.toString(),
      key,
    );
    if (!form) {
      throw new NotFoundException("Formular nicht gefunden.");
    }
    const locale = resolveContentLocale(
      dto.locale,
      site.defaultLocale,
      site.enabledLocales,
    );
    return this.submissionsService.submit(form, {
      data: dto.data ?? {},
      honeypot: dto.honeypot,
      pageUrl: dto.pageUrl,
      referrer: dto.referrer,
      locale,
      ipAddress: request.ip ?? null,
      userAgent: request.headers["user-agent"] ?? null,
    });
  }
}
