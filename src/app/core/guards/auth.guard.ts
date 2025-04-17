import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthTokenService } from '@core/services/auth-token.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthTokenService);
  const router = inject(Router);

  const isAuthenticated = !!auth.getToken();
  return isAuthenticated ? true : router.createUrlTree(['/']);
};
