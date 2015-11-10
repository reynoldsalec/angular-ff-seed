import {AUTHENTICATION_ACTIONS} from '../../actions/action-constants';
import {ServerService} from '../../services/server/server-service';

export class AuthenticationStore {

  private _tokenKey: string;
  private authenticated: Promise<any>;
  private _userSubject: Rx.ReplaySubject<any>;
  private _user: any;

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
    this._userSubject = new Rx.ReplaySubject(1);
    this._tokenKey = 'KoastToken';
  }
  
  get userSubject() {
    return this._userSubject;  
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
    this._userSubject.onNext(this.user);
  }

  private emitError(error) {
    this._userSubject.onError(error);
  }
  
  private login(credentials) {
    Rx.Observable.fromPromise(
      this.server.post('/auth', credentials))
        .subscribe(
          response => {
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
  
  get user() {
    return this._user;
  }

  private setTokenKey(tokenKey) {
    this._tokenKey = tokenKey;
  }

  private saveToken(params) {
    this.$window.localStorage.setItem(this._tokenKey, params.token);
  }

  private loadToken() {
    return this.$window.localStorage.getItem(this._tokenKey);
  }

  private clearToken() {
    return this.$window.localStorage.removeItem(this._tokenKey);
  }
}
