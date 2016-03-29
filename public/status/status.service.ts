import {Injectable} from "angular2/core";
import {ConnectableObservable} from 'rxjs/observable/ConnectableObservable';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/publish';
import {Status} from "../types/types";

@Injectable()

export class StatusService {
  status$: ConnectableObservable<Status>;
  private _statusObserver: Observer<Status>;
  private _dataStore: {
      status: Status;
  };

  constructor() {
    this._dataStore = {
      status: {volume: 0, points: 0, comments: 0 }
    };
    this.status$ = new Observable(observer => this._statusObserver = observer)
      .startWith(this._dataStore.status)
      .publish();
  }

  updateStatus(field: string, value: number) {
    if (this._dataStore.status.hasOwnProperty(field)) this._dataStore.status[field] = value;
    this._statusObserver.next(this._dataStore.status);
  }

}

