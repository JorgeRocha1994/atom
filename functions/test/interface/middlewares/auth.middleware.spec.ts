import { authInterceptor } from '../../../src/interface/middlewares/auth.middleware';
import { HttpStatus } from '../../../src/shared/utils/enums';
import * as jwt from '../../../src/shared/utils/jwt';

describe('authInterceptor', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return 401 if authorization header is missing', () => {
    authInterceptor(req, res, next);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Authorization header missing or invalid',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    req.headers.authorization = 'Bearer invalid-token';

    jest.spyOn(jwt, 'verifyToken').mockReturnValueOnce(null);

    authInterceptor(req, res, next);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid or expired token',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if token is valid', () => {
    req.headers.authorization = 'Bearer valid-token';
    jest.spyOn(jwt, 'verifyToken').mockReturnValueOnce({ id: 'user-1' });
    authInterceptor(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
