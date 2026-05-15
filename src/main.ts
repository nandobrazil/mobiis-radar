import { APP_INITIALIZER } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { ThemeService } from './app/shared/theme.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideRouter(routes, withComponentInputBinding(), withHashLocation()),
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ThemeService],
      useFactory: (theme: ThemeService) => () => theme.mode(),
    },
  ],
}).catch((error) => console.error(error));
