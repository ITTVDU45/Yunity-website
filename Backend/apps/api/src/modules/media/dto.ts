import { Type } from "class-transformer";
import { CMS_LOCALES } from "@yunity/contracts";
import {
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  Max,
  ValidateNested,
} from "class-validator";

export class PresignUploadDto {
  @IsString()
  @MaxLength(255)
  filename: string;

  @IsString()
  @MaxLength(150)
  mimeType: string;

  @IsInt()
  @IsPositive()
  size: number;

  @IsOptional()
  @IsMongoId()
  folderId?: string;
}

export class UploadMediaDto {
  @IsOptional()
  @IsMongoId()
  folderId?: string;
}

export class MediaTranslationDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  altText?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}

export class UpdateMediaDto {
  @IsOptional()
  @IsIn(CMS_LOCALES)
  locale?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaTranslationDto)
  translation?: MediaTranslationDto;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(1)
  focalPointX?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(1)
  focalPointY?: number;
}

export class CreateFolderDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsMongoId()
  parentId?: string;
}
