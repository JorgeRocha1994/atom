import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../shared/utils/jwt';
import { HttpStatus } from '../../shared/utils/enums';

export const authInterceptor = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      error: 'Authorization header missing or invalid',
    });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      error: 'Invalid or expired token',
    });
  }

  return next();
};
