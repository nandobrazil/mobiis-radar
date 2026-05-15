import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import { iconsList } from 'lucide-angular/icons';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider(iconsList),
    },
  ],
}).catch((error) => console.error(error));
