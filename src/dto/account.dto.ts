import { OmitType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';
import utils from './utils';

export class AccountDto {
  @Expose()
  _id: string;

  @IsEmail(...utils.EmailValidation)
  @Expose()
  email: string;

  @IsStrongPassword(...utils.PasswordValidation)
  @Expose()
  password: string;

  @IsString()
  @IsOptional()
  @Expose()
  account: string;

  @IsString()
  @IsOptional()
  @Expose()
  role: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class ProfileDto extends OmitType(AccountDto, ['password']) {}

export class CreateAccountDto extends OmitType(AccountDto, ['_id', 'createdAt', 'updatedAt']) {}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignPayloadDto {
  id: string;
  email: string;
  account: string | null;
  role: string | null;
}
