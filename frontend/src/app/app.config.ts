// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';

import { routes } from './app.routes';

// 1. Rejestracja polskich danych regionalnych
registerLocaleData(localePl);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideAnimations(),
    
    // 2. Ustawienie polskiego jako domyślnego języka dla DatePipe, CurrencyPipe itp.
    { provide: LOCALE_ID, useValue: 'pl' }
  ]
};