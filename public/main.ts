import {bootstrap} from 'angular2/platform/browser';
import {provide} from 'angular2/core';
import {AuthAppComponent} from './app.component';
import {APP_BASE_HREF, ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import 'rxjs/Rx';

bootstrap(AuthAppComponent, [
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  provide(AuthHttp, { 
    useFactory: (http) => {
      return new AuthHttp(new AuthConfig(), http);
    },
    deps: [Http]
  }),
  provide(APP_BASE_HREF, {useValue:'/'})
]);
