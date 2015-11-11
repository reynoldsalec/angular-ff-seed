import 'angular-ui-router';
import 'lodash-compat';

import 'basscss/css/basscss.css';
import 'font-awesome/css/font-awesome.css';
import '../css/styles.css';

import * as angular from 'angular';
import * as Rx from 'rx';

import {
  ServerService, 
  RouterService, 
  RouterConfig
} from './services';

import {
  TasksStore, 
  UsersStore, 
  AuthenticationStore,
  AccountStore
} from './stores';

import {
  LoginFormComponent,
  TaskListComponent,
  TaskComponent,
  TaskAddComponent,
  TaskEditComponent,
  MainComponent
} from './components';

import {
  TaskActions, 
  UserActions, 
  AuthenticationActions,
  AccountActions
} from './actions';


angular.module('ngcourse.router', ['ui.router'])
  .config(RouterConfig)
  .service('router', RouterService);

angular.module('ngcourse.authentication', [])
  .service('authenticationStore', AuthenticationStore)
  .service('authenticationActions', AuthenticationActions)
  .directive(
  LoginFormComponent.selector,
  LoginFormComponent.directiveFactory);

angular.module('ngcourse.tasks', [])
  .service('tasksStore', TasksStore)
  .service('tasksActions', TaskActions)
  .directive(
    TaskListComponent.selector,
    TaskListComponent.directiveFactory)
  .directive(
    TaskComponent.selector,
    TaskComponent.directiveFactory)
  .directive(
    TaskAddComponent.selector,
    TaskAddComponent.directiveFactory)
  .directive(
    TaskEditComponent.selector,
    TaskEditComponent.directiveFactory);

angular.module('ngcourse.users', [])
  .service('usersStore', UsersStore)
  .service('usersActions', UserActions);

angular.module('ngcourse.account', [])
    .service('accountStore', AccountStore)
    .service('accountActions', AccountActions);

angular.module('ngcourse.server', [])
  .service('server', ServerService);

angular.module('ngcourse.dispatcher', [])
  .service('dispatcher', Rx.Subject);

angular.module('ngcourse', [
  'ngcourse.authentication',
  'ngcourse.tasks',
  'ngcourse.users',
  'ngcourse.account',
  'ngcourse.server',
  'ngcourse.router',
  'ngcourse.dispatcher',
  'koast'])
  .factory('_', ['$window',
    function($window) {
      // place lodash include before angular
      return $window._;
    }
  ])
  .directive(
    MainComponent.selector,
    MainComponent.directiveFactory)
  .constant('API_BASE_URL', 'http://private-41342-kalademo.apiary-mock.com');

angular.element(document).ready(function() {
  angular.bootstrap(document, ['ngcourse']);
});
