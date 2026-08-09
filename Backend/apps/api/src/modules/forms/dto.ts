import { Type } from "class-transformer";
import { CMS_LOCALES } from "@yunity/contracts";
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import {
  FORM_FIELD_TYPES,
  type FormFieldType,
} from "./schemas/form.schema";
import { SUBMISSION_STATUSES } from "./schemas/form-submission.schema";

export class CreateFormDto {
  @IsString() @MaxLength(120) name: string;
  @IsOptional() @IsString() @MaxLength(60) key?: string;
  @IsOptional() @IsIn(CMS_LOCALES) locale?: string;
}

export class FormTranslationDto {
  @IsOptional() @IsString() @MaxLength(200) title?: string;
  @IsOptional() @IsString() @MaxLength(1000) successMessage?: string;
  @IsOptional() @IsString() @MaxLength(4000) privacyText?: string;
  @IsOptional() @IsString() @MaxLength(1000) consentText?: string;
}

export class UpdateFormDto {
  @IsOptional() @IsString() @MaxLength(120) name?: string;
  @IsOptional() @IsString() @MaxLength(60) key?: string;
  @IsOptional() @IsIn(["ACTIVE", "DISABLED", "ARCHIVED"]) status?: string;
  @IsOptional() @IsIn(["MESSAGE", "REDIRECT"]) successAction?: string;
  @IsOptional() @IsString() @MaxLength(500) redirectUrl?: string | null;
  @IsOptional() @IsObject() notificationSettings?: Record<string, unknown>;
  @IsOptional() @IsObject() spamSettings?: Record<string, unknown>;
  @IsOptional() @IsInt() @Min(0) retentionDays?: number | null;
  @IsOptional() @IsIn(CMS_LOCALES) locale?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FormTranslationDto)
  translation?: FormTranslationDto;
}

export class AddFieldDto {
  @IsIn(FORM_FIELD_TYPES) type: FormFieldType;
  @IsOptional() @IsIn(CMS_LOCALES) locale?: string;
}

export class FieldOptionDto {
  @IsString() @MaxLength(160) value: string;
  @IsOptional() @IsString() @MaxLength(200) label?: string;
  @IsOptional() @IsBoolean() isEnabled?: boolean;
}

export class FieldTranslationDto {
  @IsOptional() @IsString() @MaxLength(200) label?: string;
  @IsOptional() @IsString() @MaxLength(200) placeholder?: string;
  @IsOptional() @IsString() @MaxLength(400) helpText?: string;
}

export class UpdateFieldDto {
  @IsOptional() @IsString() @MaxLength(60) name?: string;
  @IsOptional() @IsBoolean() required?: boolean;
  @IsOptional() @IsIn(["FULL", "HALF", "THIRD"]) width?: string;
  @IsOptional() @IsBoolean() isEnabled?: boolean;
  @IsOptional() @IsObject() validation?: Record<string, unknown>;
  @IsOptional() @IsObject() conditions?: Record<string, unknown> | null;
  @IsOptional() @IsObject() settings?: Record<string, unknown>;
  @IsOptional() @IsIn(CMS_LOCALES) locale?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FieldTranslationDto)
  translation?: FieldTranslationDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldOptionDto)
  options?: FieldOptionDto[];
}

export class ReorderFieldsDto {
  @IsArray()
  @IsString({ each: true })
  orderedIds: string[];
}

export class UpdateSubmissionDto {
  @IsOptional() @IsIn(SUBMISSION_STATUSES) status?: string;
  @IsOptional() @IsString() @MaxLength(2000) notes?: string;
}

/** Oeffentliche Uebermittlung: data wird dynamisch gegen die Felder validiert. */
export class SubmitFormDto {
  @IsObject() data: Record<string, unknown>;

  /** Honeypot — muss leer sein (Spam-Schutz). */
  @IsOptional() @IsString() honeypot?: string;

  @IsOptional() @IsString() @MaxLength(500) pageUrl?: string;
  @IsOptional() @IsString() @MaxLength(500) referrer?: string;
  @IsOptional() @IsIn(CMS_LOCALES) locale?: string;
}
