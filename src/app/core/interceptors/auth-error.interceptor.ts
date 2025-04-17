import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthTokenService } from '../services/auth-token.service';
import { HttpStatus } from '@shared/utils/enums';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authTokenService = inject(AuthTokenService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === HttpStatus.UNAUTHORIZED ||
        error.status === HttpStatus.FORBIDDEN
      ) {
        console.warn('[Auth] Unauthorized. Redirecting to login...');
        authTokenService.clear();
      }

      return throwError(() => error);
    })
  );
};
