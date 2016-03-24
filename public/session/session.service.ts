import {Injectable} from "angular2/core";
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';
import {User} from "../types/types";

@Injectable()

export class SessionService {
  user$: Observable<User>;
  private _userObserver: Observer<User>;
  private _dataStore: {
      user: User;
  };

  constructor() {
    this.user$ = new Observable(observer => this._userObserver = observer).share();
    this._dataStore = {
      user: {
        _id: '',
        auth_id: '',
        name: '',
        convos: []
      }
    };
  }

  getUser() {
    this._userObserver.next(this._dataStore.user);
  }

  updateUser(newItem: User) {
    this._dataStore.user = newItem;
    this._userObserver.next(this._dataStore.user);
  }

  clearUser() {
    this._dataStore.user = <User>{};
    this._userObserver.next(this._dataStore.user);
  }
}

