import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class LoginDto {
  @IsEmail()
  @MaxLength(320)
  email: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  password: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

export class ForgotPasswordDto {
  @IsEmail()
  @MaxLength(320)
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  token: string;

  @IsString()
  @MinLength(12, {
    message: "Das Passwort muss mindestens 12 Zeichen lang sein.",
  })
  @MaxLength(200)
  password: string;
}
