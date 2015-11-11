import {makeAuthenticatedMethod} from '../../utils/store-utils';
import {USER_ACTIONS} from '../../actions/action-constants';
import {List, Map, fromJS} from 'immutable';

export class UsersStore {

  private _users: Map<String, any>;
  private _usersSubject: Rx.ReplaySubject<any>;

  static $inject = [
    'koast',
    'dispatcher'
  ];

  constructor(
    private koast,
    private dispatcher: Rx.Subject<any>
  ) {
    this.registerActionHandlers();
    this.initialize();
  }

  private initialize() {
    this._users = Map<String, any>();
    this._usersSubject = new Rx.ReplaySubject(1);
  }

  get usersSubject() {
    return this._usersSubject;
  }

  private registerActionHandlers() {
    this.dispatcher.filter(
      (action) => action.actionType === USER_ACTIONS.GET_USERS)
      .subscribe((action) => this.getUsers(action.token));
  }

  private getUsers(token) {
    Rx.Observable.fromPromise(
      this.server.get('/users', {params: {token: token}}))
      .subscribe(
        response => {
          this._users = response;
          this.emitChange();
        },
        error => this.emitError(error));
}

  private emitChange() {
    this._usersSubject.onNext(this.users);
  }

  private emitError(error) {
    this._usersSubject.onError(error);
  }

  get users() {
    return this._users.toJS();
  }
}
