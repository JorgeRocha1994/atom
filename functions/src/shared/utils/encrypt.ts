import crypto from 'crypto';

export const hashEmail = (email: string): string => {
  if (!email) return '';
  return crypto.createHash('sha256').update(email).digest('hex');
};
