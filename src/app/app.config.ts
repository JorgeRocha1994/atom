import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from '@core/interceptors/token.interceptor';
import { authErrorInterceptor } from '@core/interceptors/auth-error.interceptor';
import { routes } from './app.routes';

import { UserProviders } from '@core/providers/user.providers';
import { TaskProviders } from '@core/providers/task.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([tokenInterceptor, authErrorInterceptor])
    ),
    ...UserProviders,
    ...TaskProviders,
  ],
};
