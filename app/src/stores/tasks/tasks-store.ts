import {makeAuthenticatedMethod} from '../../utils/store-utils';
import {ServerService} from '../../services/server/server-service';
import {TASK_ACTIONS} from '../../actions/action-constants';

import {List, fromJS} from 'immutable';
import * as Rx from 'rx';

export class TasksStore {
  private _tasksSubject: Rx.ReplaySubject<any>;
  private _tasks: List<any>;

  static $inject = [
    'server',
    'dispatcher'
  ];
  
  constructor(
    private server,
    private dispatcher: Rx.Subject<any>
  ) {
    this.registerActionHandlers();
    this.initialize();
  }

  private initialize() {
    this._tasks = List();
    this._tasksSubject = new Rx.ReplaySubject(1);
  }

  get tasksSubject() {
    return this._tasksSubject;
  }

  private registerActionHandlers() {
    this.dispatcher.filter(
      action => action.actionType === TASK_ACTIONS.GET_TASKS)
      .subscribe(action => this.getTasks(action.token));
/*
    this.dispatcher.filter(
      action => action.actionType === TASK_ACTIONS.ADD_TASK)
      .subscribe(action => this.addTask(action.newTask));

    this.dispatcher.filter(
      action => action.actionType === TASK_ACTIONS.UPDATE_TASK)
      .subscribe(action => this.updateTask(action.task));
*/
  }

  private getTasks(token) {
    Rx.Observable.fromPromise(
      this.server.get('/questions', {params: {token: token}}))
      .subscribe(
        response => {
          this._tasks = response;
          this.emitChange();
        },
        error => this.emitError(error));
  }

  private getTask(id) {
    return this._tasks[id];
  }

    /*
    @todo: reimplement.
    this.addTask = makeAuthenticatedMethod(
      this.koast,
      task => Rx.Observable.fromPromise(
        this.koast.createResource('tasks', task))
        .subscribe(() => this.getTasks())
    );

    this.updateTask = makeAuthenticatedMethod(
      this.koast,
      task => task.save()
        .then(this.getTasks)
    );
  }
  */
  private emitChange() {
    this._tasksSubject.onNext(this.tasks);
  }

  private emitError(error) {
    this._tasksSubject.onError(error);
  }

  get tasks() {
    return this._tasks.toJS();
  }

  public getTaskById(id) {
    return this._tasks.find(
      task => task._id === id);
  }

}
