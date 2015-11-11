import {AUTHENTICATION_ACTIONS} from '../../actions/action-constants';
import {ServerService} from '../../services/server/server-service';

export class AuthenticationStore {

  private _tokenKey: string;
  private authenticated: Promise<any>;
  private _tokenSubject: Rx.ReplaySubject<any>;
  private _token: any;
  private _id: any;

  static $inject = [
    '$window',
    'server',
    'dispatcher'
  ];

  constructor(
      private $window,
      private server,
      private dispatcher: Rx.Subject<any>
    ) {
    this.initialize();
    this.registerActionHandlers();
  }
  
  private initialize() {
    this._tokenSubject = new Rx.ReplaySubject(1);
    this._tokenKey = 'KoastToken';
  }
  
  get userSubject() {
    return this._tokenSubject;  
  }
  
  private registerActionHandlers() {
    this.dispatcher.filter(
      action => action.actionType === AUTHENTICATION_ACTIONS.LOGIN)
        .subscribe((action) => this.login(action.credentials));

    this.dispatcher.filter(
      action => action.actionType === AUTHENTICATION_ACTIONS.LOGOUT)
        .subscribe(() => this.logout());
  }

  private emitChange() {
    this._tokenSubject.onNext({token: this._token, id: this._id});
  }

  private emitError(error) {
    this._tokenSubject.onError(error);
  }
  
  private login(credentials) {
    Rx.Observable.fromPromise(
      this.server.post('/auth', credentials))
        .subscribe(
          (response) => {
            console.log(response);
            this.saveAuth(response);
            this.emitChange();
          },
          error => this.emitError(error)); 
  }

  private logout() {
    if (!_.isEmpty(this._token)) {
      this.clearToken();
      this.emitChange();
    }
  }
  
  get token() {
    return this._token;
  }

  get tokenSubject() {
    return this._tokenSubject;
  }

  private setTokenKey(tokenKey) {
    this._tokenKey = tokenKey;
  }

  private saveAuth(response) {
    //this.$window.localStorage.setItem(this._tokenKey, params.token);
    this._token = response.token;
    this._id = response.id;
  }

  private clearToken() {
    this._token = null;
    this._id = null;
    //return this.$window.localStorage.removeItem(this._tokenKey);
  }

}
