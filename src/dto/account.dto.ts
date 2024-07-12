import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class CreateAccountDto {
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
  password: string;

  @IsString()
  @IsOptional()
  account: string;

  @IsString()
  @IsOptional()
  role: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignPayloadDto {
  email: string;

  account: string | null;

  role: string | null;
}
