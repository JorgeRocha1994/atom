export const getEnvironment = (): string => process.env.ENVIRONMENT || 'dev';

export const getJwtSecret = (): string => {
  if (!process.env.SECRET_JWT) {
    throw new Error('Missing environment variable: SECRET_JWT');
  }
  return process.env.SECRET_JWT;
};

export const getJwtExpiresAt = (): number => parseInt(process.env.EXPIRES_AT || '10', 10);
