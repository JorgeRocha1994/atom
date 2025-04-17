import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { EXCLUDED_PATHS } from '@shared/utils/router';
import { AuthTokenService } from '../services/auth-token.service';

export const tokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const authTokenService = inject(AuthTokenService);

  const isExcluded = EXCLUDED_PATHS.some((path) => req.url.includes(path));

  if (isExcluded) {
    return next(req);
  }

  const token = authTokenService.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(cloned);
  }

  return next(req);
};
