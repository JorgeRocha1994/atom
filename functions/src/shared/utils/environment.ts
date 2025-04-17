import { defineSecret, defineString, defineInt } from 'firebase-functions/params';

export const secretJwt = defineSecret('SECRET_JWT');
export const envEnvironment = defineString('ENVIRONMENT');
export const envExpiresAt = defineInt('EXPIRES_AT');

export const getJwtSecret = (): string => secretJwt.value() ?? process.env.SECRET_JWT;
export const getEnvironment = (): string =>
  envEnvironment.value() ?? process.env.ENVIRONMENT ?? 'dev';
export const getJwtExpiresAt = (): number => envExpiresAt.value() ?? process.env.EXPIRES_AT ?? 10;
