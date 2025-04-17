import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { AuthTokenService } from '@core/services/auth-token.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private authTokenService = inject(AuthTokenService);

  isDevelopment = environment.production === false;
  envName = environment.environmentName;

  pageTitle = 'Task Manager';
  showToolbar = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute.firstChild;
          while (route?.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap((route) => route?.data ?? [])
      )
      .subscribe((data) => {
        this.showToolbar = data['showToolbar'] ?? true;
        this.pageTitle = `📝 Task Manager${
          data['title'] ? ' | ' + data['title'] : ''
        }`;
      });
  }

  signOut() {
    this.authTokenService.clear();
  }
}
