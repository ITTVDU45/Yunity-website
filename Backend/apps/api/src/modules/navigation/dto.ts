import {
  IsArray,
  IsBoolean,
  IsIn,
  IsMongoId,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { CMS_LOCALES } from "@yunity/contracts";

const ITEM_TYPES = [
  "PAGE",
  "EXTERNAL",
  "ANCHOR",
  "GROUP",
  "BUTTON",
  "COLLECTION",
  "PLACEHOLDER",
] as const;

export class CreateNavigationDto {
  @IsString()
  @MaxLength(50)
  key: string;

  @IsString()
  @MaxLength(120)
  name: string;
}

export class CreateNavigationItemDto {
  @IsIn(ITEM_TYPES)
  type: (typeof ITEM_TYPES)[number];

  @IsString()
  @MaxLength(120)
  label: string;

  @IsOptional()
  @IsIn(CMS_LOCALES)
  locale?: string;

  @IsOptional()
  @IsMongoId()
  parentId?: string;

  @IsOptional()
  @IsMongoId()
  pageId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  anchor?: string;

  @IsOptional()
  @IsIn(["SELF", "BLANK"])
  target?: "SELF" | "BLANK";

  @IsOptional()
  @IsString()
  @MaxLength(60)
  icon?: string;
}

export class UpdateNavigationItemDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  label?: string;

  @IsOptional()
  @IsObject()
  translations?: Record<string, string>;

  @IsOptional()
  @IsIn(ITEM_TYPES)
  type?: (typeof ITEM_TYPES)[number];

  @IsOptional()
  @IsMongoId()
  pageId?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  url?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  anchor?: string | null;

  @IsOptional()
  @IsIn(["SELF", "BLANK"])
  target?: "SELF" | "BLANK";

  @IsOptional()
  @IsString()
  @MaxLength(60)
  icon?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  cssClass?: string | null;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}

/** Ein Eintrag der neuen Reihenfolge: Item-Id + (evtl. neuer) Elternknoten. */
export class ReorderEntryDto {
  @IsMongoId()
  id: string;

  @IsOptional()
  @IsMongoId()
  parentId?: string | null;
}

export class ReorderNavigationDto {
  @IsArray()
  order: ReorderEntryDto[];
}
