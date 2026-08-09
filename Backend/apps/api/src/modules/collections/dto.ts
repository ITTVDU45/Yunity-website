import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { WORKFLOW_ACTIONS } from "../pages/publishing/actions";
import { CMS_LOCALES } from "@yunity/contracts";
import {
  CONTACT_FIELD_TYPES,
  type ContactFieldType,
} from "./contact-field.schema";

export class CreateCollectionDto {
  @IsOptional() @IsString() @MaxLength(200) title?: string;
  @IsOptional() @IsString() @MaxLength(200) slug?: string;
  @IsOptional() @IsIn(CMS_LOCALES) locale?: string;
  @IsOptional() @IsObject() attributes?: Record<string, unknown>;
}

export class CollectionTranslationDto {
  @IsOptional() @IsString() @MaxLength(200) title?: string;
  @IsOptional() @IsString() @MaxLength(200) subtitle?: string;
  @IsOptional() @IsString() @MaxLength(1000) excerpt?: string;
  @IsOptional() @IsString() @MaxLength(20000) body?: string;
  @IsOptional() @IsString() @MaxLength(200) slug?: string;
  @IsOptional() @IsString() @MaxLength(200) metaTitle?: string;
  @IsOptional() @IsString() @MaxLength(400) metaDescription?: string;
  @IsOptional() @IsObject() details?: Record<string, unknown>;
  @IsOptional()
  @IsIn(["MISSING", "DRAFT", "COMPLETE", "NEEDS_REVIEW"])
  translationStatus?: "MISSING" | "DRAFT" | "COMPLETE" | "NEEDS_REVIEW";
}

export class CollectionRelationsDto {
  @IsOptional() @IsArray() @IsString({ each: true }) serviceIds?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) industryIds?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) competencyIds?: string[];
}

export class UpdateCollectionDto {
  @IsOptional() @IsIn(CMS_LOCALES) locale?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CollectionTranslationDto)
  translation?: CollectionTranslationDto;

  @IsOptional() @IsObject() attributes?: Record<string, unknown>;

  @IsOptional()
  @ValidateNested()
  @Type(() => CollectionRelationsDto)
  relations?: CollectionRelationsDto;

  @IsOptional() @IsString() @MaxLength(60) imageId?: string | null;
  @IsOptional() @IsString() @MaxLength(60) icon?: string | null;
  @IsOptional() @IsBoolean() featured?: boolean;
}

export class ReorderDto {
  @IsArray()
  @IsString({ each: true })
  orderedIds: string[];
}

export class CollectionWorkflowDto {
  @IsIn(WORKFLOW_ACTIONS)
  action: (typeof WORKFLOW_ACTIONS)[number];
}

export class CreateContactFieldDto {
  @IsIn(CONTACT_FIELD_TYPES) fieldType: ContactFieldType;
  @IsString() @MaxLength(120) label: string;
  @IsOptional() @IsIn(CMS_LOCALES) locale?: string;
  @IsString() @MaxLength(300) value: string;
  @IsOptional() @IsString() @MaxLength(500) link?: string;
  @IsOptional() @IsString() @MaxLength(60) icon?: string;
  @IsOptional() @IsBoolean() isPublic?: boolean;
}

export class UpdateContactFieldDto {
  @IsOptional() @IsIn(CONTACT_FIELD_TYPES) fieldType?: ContactFieldType;
  @IsOptional() @IsString() @MaxLength(120) label?: string;
  @IsOptional() @IsIn(CMS_LOCALES) locale?: string;
  @IsOptional() @IsString() @MaxLength(300) value?: string;
  @IsOptional() @IsString() @MaxLength(500) link?: string | null;
  @IsOptional() @IsString() @MaxLength(60) icon?: string | null;
  @IsOptional() @IsBoolean() isPublic?: boolean;
}

export class TaxonomyDto {
  @IsString() @MaxLength(160) title: string;
  @IsOptional() @IsString() @MaxLength(600) description?: string;
  @IsOptional() @IsIn(CMS_LOCALES) locale?: string;
}
