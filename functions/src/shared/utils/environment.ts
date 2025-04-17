import { defineSecret, defineString, defineInt } from 'firebase-functions/params';

export const secretJwt = defineSecret('SECRET_JWT');
export const envEnvironment = defineString('ENVIRONMENT');
export const envExpiresAt = defineInt('EXPIRES_AT');

export const getJwtSecret = (): string => {
  return secretJwt.value() ?? process.env.SECRET_JWT ?? '';
};

export const getEnvironment = (): string => {
  return envEnvironment.value() ?? process.env.ENVIRONMENT ?? 'dev';
};

export const getJwtExpiresAt = (): number => {
  const envValue = envExpiresAt.value();
  const fallback = process.env.EXPIRES_AT ? parseInt(process.env.EXPIRES_AT, 10) : 10;
  return envValue ?? fallback;
};
