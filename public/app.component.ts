import { Component }       from "angular2/core";
import { RouteConfig, ROUTER_DIRECTIVES } from "angular2/router";
import { ApiService }     from "./api/api.service";
import { AboutComponent } from "./about/about.component";
import { ConvosComponent } from "./convos/convos.component";
import { AuthHttp, tokenNotExpired, JwtHelper} from 'angular2-jwt';

declare var Auth0Lock;

@Component({
  directives: [ ROUTER_DIRECTIVES ],
  selector: 'app',
  template: `
    <h1>{{title}}</h1>
    <button *ngIf="!loggedIn()" (click)="login()">Login</button>
    <button *ngIf="loggedIn()" (click)="logout()">Logout</button>
    <hr>
    <div>
      <button [routerLink]="['About']">About</button>
      <button *ngIf="loggedIn()" [routerLink]="['Convos']">Your conversations</button>
      <router-outlet></router-outlet>
    </div>`,
  providers: [ApiService]
})

@RouteConfig([
  {    path: "/about",      name: "About",     component: AboutComponent     },
  {    path: "/convos",     name: "Convos",    component: ConvosComponent    },
  /*{    path: "/cart",         name: "Cart",        component: CartComponent       },
  {    path: "/order",        name: "Order",       component: OrderComponent      }*/
])


export class AuthAppComponent {

  title = "Awkward Silence";
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