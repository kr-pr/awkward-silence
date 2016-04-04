import { Component }       from "angular2/core";
import { RouteConfig, ROUTER_DIRECTIVES } from "angular2/router";
import { ApiService }     from "./api/api.service";
import { AboutComponent } from "./about/about.component";
import { LandingComponent } from "./about/landing";
import { ConvosComponent } from "./convos/convos.component";
import { RecordsComponent } from "./records/records.component";
import { ViewComponent } from "./view/view.component";
import { AuthHttp, tokenNotExpired, JwtHelper} from 'angular2-jwt';

declare var Auth0Lock;

@Component({
  directives: [ ROUTER_DIRECTIVES ],
  selector: 'app',
  template: `
    <section id="top-menu-bar">
      <br>
      <button class="pure-button button-small" [routerLink]="['About']">About</button>
      <button class="pure-button button-small" *ngIf="!loggedIn()" (click)="login()">Login</button>
      <button class="pure-button button-small" *ngIf="loggedIn()" [routerLink]="['Convos']">Conversations</button>
      <button class="pure-button button-small" *ngIf="loggedIn()" (click)="logout()">Logout</button>
    </section>
    <br>
    <div>
      <router-outlet>
      </router-outlet>
    </div>`,
  providers: [ApiService]
})

@RouteConfig([
  {    path: "/",             name: "Land",     component: LandingComponent,  useAsDefault: true },
  {    path: "/about",        name: "About",    component: AboutComponent     },
  {    path: "/convos",       name: "Convos",   component: ConvosComponent    },
  {    path: "/records/:id",  name: "Records",  component: RecordsComponent   },
  {    path: "/convo/:id",    name: "Views",    component: ViewComponent      }
])


export class AuthAppComponent {

  lock = new Auth0Lock('nacrIJP96MTF6yUTXredeH4fvui6AlFo', 'kprostyakov.auth0.com');
  constructor(public authHttp:AuthHttp) {}

  tokenSubscription() {
    this.authHttp.tokenStream.subscribe(
        data => console.log(data),
        err => console.log(err),
        () => console.log('Complete')
      );
  }

  login() {
    this.lock.show(function(err:string, profile:string, id_token:string) {

      if(err) {
        throw new Error(err);
      }

      localStorage.setItem('profile', JSON.stringify(profile));
      localStorage.setItem('id_token', id_token);

    });
  }

  logout() {
    localStorage.removeItem('profile');
    localStorage.removeItem('id_token');
  }

  loggedIn() {
    return tokenNotExpired();
  }
}