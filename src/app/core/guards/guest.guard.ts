import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthTokenService } from '@core/services/auth-token.service';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthTokenService);
  const router = inject(Router);

  const isAuthenticated = !!auth.getToken();
  return isAuthenticated ? router.createUrlTree(['/dashboard']) : true;
};
