import {Injectable} from "angular2/core";
import {Http, Headers, Response} from "angular2/http";
import {Observable}     from "rxjs/Observable";
import {User, Convo, Record, Status} from "../types/types";
import {AuthHttp, tokenNotExpired } from 'angular2-jwt';

@Injectable()

export class ApiService {

  private headers: Headers;
  private baseUrl = "http://localhost:8777/api/";
  constructor(public authHttp: AuthHttp) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  getUserConvos() {
    return this.authHttp.get(this.baseUrl + "convos")
                    .map(res => <User> res.json()[0])
                    .catch(this.handleError);
  }

  addConvo(obj: string) {

    return this.authHttp.post(this.baseUrl + "convo", (obj), {headers: this.headers})
                    .map(res => <Convo> res.json())
                    .catch(this.handleError);
  }

  getView(id: string) {
    return this.authHttp.get(this.baseUrl + "view/" + id)
                    //.do(data => console.log(data.json()))
                    .map(res => <Convo> res.json())
                    .catch(this.handleError);
  }

  getRecords(id: string) {
    return this.authHttp.get(this.baseUrl + "convo/" + id)
                    .map(res => <Convo> res.json())
                    .catch(this.handleError);
  }

  addRecord(obj: string) {
    return this.authHttp.post(this.baseUrl + "record", obj, {headers: this.headers})
                    .map(res => <Record> res.json())
                    .catch(this.handleError);
  }

  updateRecord(id: string, obj: string) {
    return this.authHttp.put(this.baseUrl + "record/" + id, obj, {headers: this.headers})
                    .map(res => <Status> res.json())
                    .catch(this.handleError);
  }
  private handleError (error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}