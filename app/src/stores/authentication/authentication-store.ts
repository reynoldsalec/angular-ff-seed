import {AUTHENTICATION_ACTIONS} from '../../actions/action-constants';
import {ServerService} from '../../services/server/server-service';

export class AuthenticationStore {

  private _tokenKey: string;
  private authenticated: Promise<any>;
  private _tokenSubject: Rx.ReplaySubject<any>;
  private _token: any;

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
    this._tokenSubject.onNext(this._token);
  }

  private emitError(error) {
    this._tokenSubject.onError(error);
  }
  
  private login(credentials) {
    Rx.Observable.fromPromise(
      this.server.post('/auth', credentials))
        .subscribe(
          (response) => {
            this.saveToken(response.token);
            this.emitChange();
          },
          error => this.emitError(error)); 
  }

  private logout() {
    console.log(this.authenticated);
    if (this.authenticated) {
      this.authenticated = null;
      // this.clearToken();
      // todo: set token?
    }
    /*
    Rx.Observable.fromPromise(
      this.authenticationService.logout())
        .subscribe(
          data => {
            console.log(data);
            // this._user = this.koast.user;
            this.emitChange();
          },
          error => this.emitError(error));
    */
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

  private saveToken(token) {
    //this.$window.localStorage.setItem(this._tokenKey, params.token);
    this._token = token;
  }

  private clearToken() {
    this._token = null;
    return this.$window.localStorage.removeItem(this._tokenKey);
  }

  public isAuthenticated() {
    return this.authenticated;
  }
}
