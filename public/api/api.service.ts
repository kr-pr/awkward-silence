import {Injectable} from "angular2/core";
import {Http, Headers, Response} from "angular2/http";
import {Observable}     from "rxjs/Observable";
import {User} from "../types/types";
import {AuthHttp, tokenNotExpired } from 'angular2-jwt';
@Injectable()
export class ApiService {
  constructor(public authHttp:AuthHttp) {}
  private baseUrl = "http://localhost:8777/";

  getUserConvos() {
    return this.authHttp.get(this.baseUrl + "convos")
                    .do(data => console.log(data.json()))
                    .map(res => <User> res.json())
                    .catch(this.handleError);
  }

  private handleError (error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}