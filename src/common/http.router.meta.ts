import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC = 'IS_PUBLIC';
export const Public = () => SetMetadata(IS_PUBLIC, true);

export const IS_API_KEY = 'IS_API_KEY';
export const ApiKey = () => SetMetadata(IS_API_KEY, true);

export const IS_JWT_KEY = 'IS_JWT_KEY';
export const JwtKey = () => SetMetadata(IS_JWT_KEY, true);
