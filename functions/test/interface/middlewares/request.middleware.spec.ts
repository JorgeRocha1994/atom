import {
  validateUserId,
  validateTaskId,
  validateBody,
} from '../../../src/interface/middlewares/request.middleware';
import { HttpStatus } from '../../../src/shared/utils/enums';

describe('Request Middlewares', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('validateUserId', () => {
    it('should call next if userId is valid', () => {
      req.params = { userId: 'abc123' };

      validateUserId(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 400 if userId is missing or empty', () => {
      req.params = { userId: '' };

      validateUserId(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        status: HttpStatus.BAD_REQUEST,
        error: 'User Id is required',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateTaskId', () => {
    it('should call next if taskId is valid', () => {
      req.params = { taskId: 'task-001' };

      validateTaskId(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 400 if taskId is missing or empty', () => {
      req.params = { taskId: '' };

      validateTaskId(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        status: HttpStatus.BAD_REQUEST,
        error: 'Task Id is required',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateBody', () => {
    it('should call next if body is a valid object', () => {
      req.body = { name: 'Task' };

      validateBody(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 400 if body is empty', () => {
      req.body = {};

      validateBody(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        status: HttpStatus.BAD_REQUEST,
        error: 'Valid request body is required',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if body is not an object', () => {
      req.body = null;

      validateBody(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        status: HttpStatus.BAD_REQUEST,
        error: 'Valid request body is required',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
