import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { ThemeService } from './app/shared/theme.service';

registerLocaleData(localePt, 'pt-BR');

bootstrapApplication(AppComponent, {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    provideRouter(routes, withComponentInputBinding(), withHashLocation()),
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ThemeService],
      useFactory: (theme: ThemeService) => () => theme.mode(),
    },
  ],
}).catch((error) => console.error(error));
