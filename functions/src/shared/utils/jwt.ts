import jwt from 'jsonwebtoken';
import { getEnvironment, getJwtExpiresAt } from './environment';

const secretKey = getEnvironment();
const expiresIn = getJwtExpiresAt();

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, secretKey, { expiresIn: `${expiresIn}m` });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
};
