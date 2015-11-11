import {AuthenticationStore}
from '../../stores/authentication/authentication-store';
import {UsersStore} from '../../stores/users/users-store';
import {AccountStore} from '../../stores/account/account-store';
import {AuthenticationActions}
from '../../actions/authentication/authentication-actions';
import {AccountActions}
  from '../../actions/account/account-actions';

export class MainComponent {

  private _account: any;
  private _token: String;
  private _id: String;
  private _displayName: String;
  private _errorMessage: String;

  static selector = 'ngcMain';

  static directiveFactory: ng.IDirectiveFactory = () => {
    return {
      transclude: true,
      restrict: 'E',
      scope: {},
      controllerAs: 'ctrl',
      bindToController: true,
      controller: MainComponent,
      template: require('./main-component.html')
    };
  };

  static $inject = [
    '$scope',
    'authenticationStore',
    'authenticationActions',
    'accountStore',
    'accountActions',
    'usersStore',
    '_'
  ];

  constructor(
    private $scope: angular.IScope,
    private authenticationStore: AuthenticationStore,
    private authenticationActions: AuthenticationActions,
    private accountStore: AccountStore,
    private accountActions: AccountActions,
    private usersStore: UsersStore,
    private _: any) {

    let authSubscription =
      this.authenticationStore.tokenSubject.subscribe(
        response => {
          this._token = response.token;
          this._id = response.id;
          this.getAccount();
        },
        error => this._errorMessage = error);

    let accountSubscription =
      this.accountStore.accountSubject.subscribe(
        account => this._account = account,
        error => this._errorMessage = error);

    this.$scope.$on('$destroy', () => {
      authSubscription.dispose();
      accountSubscription.dispose();
    });
  }

  private login(form) {
    this.authenticationActions.login(form);
  }

  private logout() {
    this.authenticationActions.logout();
  }

  get account() {
    return this._account;
  }

  private getAccount() {
    if (this._.isEmpty(this._token) && this._.isEmpty(this._id)) {
      this.accountActions.getAccount(this._id, this._token);
    }
  }

  get isAuthenticated() {
    return !this._.isEmpty(this._token);
  }

  get displayName() {
    return this._displayName;
  }

  get errorMessage() {
    return this._errorMessage;
  }
}
