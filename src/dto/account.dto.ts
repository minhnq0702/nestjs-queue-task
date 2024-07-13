import { OmitType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class AccountDto {
  @IsString()
  @IsOptional()
  @Expose()
  _id: string;

  @IsEmail(
    {
      allow_ip_domain: false,
      allow_utf8_local_part: true,
      // require_tld: true,
    },
    {
      message: 'Invalid email', // TODO change to CODE
    },
  )
  @Expose()
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
    },
    {
      message: 'Password is too weak', // TODO change to CODE
    },
  )
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

  @IsDate()
  @Expose()
  createdAt: Date;

  @IsDate()
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
