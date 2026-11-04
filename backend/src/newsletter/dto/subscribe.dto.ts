import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SubscribeDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  preference?: string;
}

export class PreferenceDto {
  @IsEmail()
  email!: string;

  @IsString()
  preference!: string;
}

export class UnsubscribeDto {
  @IsEmail()
  email!: string;
}

