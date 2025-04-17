import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../shared/utils/enums';

export const validateUserId = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;
  if (!userId?.trim()) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ status: HttpStatus.BAD_REQUEST, error: 'User Id is required' });
  }
  return next();
};

export const validateTaskId = (req: Request, res: Response, next: NextFunction) => {
  const taskId = req.params.taskId;
  if (!taskId?.trim()) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ status: HttpStatus.BAD_REQUEST, error: 'Task Id is required' });
  }
  return next();
};

export const validateBody = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      status: HttpStatus.BAD_REQUEST,
      error: 'Valid request body is required',
    });
  }
  return next();
};
