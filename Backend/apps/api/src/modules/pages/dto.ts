import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsISO8601,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { WORKFLOW_ACTIONS } from "./publishing/actions";
import { CMS_LOCALES } from "@yunity/contracts";

export class CreatePageDto {
  @IsString()
  @MaxLength(200)
  internalName: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  templateKey?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  slug?: string;

  @IsOptional()
  @IsIn(CMS_LOCALES)
  locale?: string;

  @IsOptional()
  @IsBoolean()
  isHomepage?: boolean;
}

export class PageTranslationDto {
  @IsOptional() @IsString() @MaxLength(200) title?: string;
  @IsOptional() @IsString() @MaxLength(200) navigationTitle?: string;
  @IsOptional() @IsString() @MaxLength(200) slug?: string;
  @IsOptional() @IsString() @MaxLength(200) metaTitle?: string;
  @IsOptional() @IsString() @MaxLength(400) metaDescription?: string;
  @IsOptional() @IsString() @MaxLength(200) ogTitle?: string;
  @IsOptional() @IsString() @MaxLength(400) ogDescription?: string;
  @IsOptional() @IsString() @MaxLength(60) ogImageId?: string;
  @IsOptional() @IsString() @MaxLength(500) canonicalUrl?: string;
  @IsOptional() @IsBoolean() noIndex?: boolean;
  @IsOptional() @IsBoolean() noFollow?: boolean;
  @IsOptional()
  @IsIn(["MISSING", "DRAFT", "COMPLETE", "NEEDS_REVIEW"])
  translationStatus?: "MISSING" | "DRAFT" | "COMPLETE" | "NEEDS_REVIEW";
}

export class UpdatePageDto {
  @IsOptional() @IsString() @MaxLength(200) internalName?: string;
  @IsOptional() @IsString() @MaxLength(60) templateKey?: string;
  @IsOptional() @IsBoolean() isHomepage?: boolean;
  @IsOptional() @IsIn(CMS_LOCALES) locale?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PageTranslationDto)
  translation?: PageTranslationDto;
}

export class AddSectionDto {
  @IsString()
  @MaxLength(60)
  blockType: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  internalLabel?: string;
}

export class UpdateSectionDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  internalLabel?: string;

  @IsOptional()
  @IsIn(CMS_LOCALES)
  locale?: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}

export class ReorderSectionsDto {
  @IsArray()
  @IsString({ each: true })
  orderedIds: string[];
}

export class WorkflowActionDto {
  @IsIn(WORKFLOW_ACTIONS)
  action: (typeof WORKFLOW_ACTIONS)[number];

  @IsOptional()
  @IsISO8601()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  changeSummary?: string;
}
