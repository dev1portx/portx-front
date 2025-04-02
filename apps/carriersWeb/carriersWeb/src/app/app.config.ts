import { ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { appRoutes } from './app.routes';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideLottieOptions } from 'ngx-lottie';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { provideEnvironmentNgxMask } from 'ngx-mask';

import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { TimeoutInterceptor } from './shared/interceptors/timeout.interceptor';
import { CustomRouteReuseStrategy } from './shared/pages/map-dashboard/custom-reuse-strategy';
import { IonicRouteStrategy } from '@ionic/angular';
import { BegoModule } from '@begomx/ui-components';
import { environment } from 'src/environments/environment';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    { provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideLottieOptions({
      player: () => import('lottie-web'),
    }),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    provideHttpClient(withInterceptorsFromDi()),
    provideEnvironmentNgxMask(),
    provideAnimations(),
    BegoModule.forRoot(() => ({
      onAuthError: () => console.log('auth error'),
      token: localStorage.getItem('token'),
      urlBase: environment.URL_BASE,
    })).providers,
  ],
};
