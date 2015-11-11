import {makeAuthenticatedMethod} from '../../utils/store-utils';
import {ServerService} from '../../services/server/server-service';
import {ACCOUNT_ACTIONS} from '../../actions/action-constants';
import {List, Map, fromJS} from 'immutable';

export class AccountStore {

    private _account: Map<String, any>;
    private _accountSubject: Rx.ReplaySubject<any>;

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
        this._account = Map<String, any>();
        this._accountSubject = new Rx.ReplaySubject(1);
    }

    get accountSubject() {
        return this._accountSubject;
    }

    private registerActionHandlers() {
        this.dispatcher.filter(
            (action) => action.actionType === ACCOUNT_ACTIONS.GET_ACCOUNT)
            .subscribe((action) => this.getAccount(action.id, action.token));
    }

    private getAccount(id, token) {
        Rx.Observable.fromPromise(
            this.server.get('/users/' + id, {params: {token: token}}))
            .subscribe(
                response => {
                    this._account = response;
                    this.emitChange();
                },
                error => this.emitError(error));
    }

    private emitChange() {
        this._accountSubject.onNext(this.account);
    }

    private emitError(error) {
        this._accountSubject.onError(error);
    }

    get account() {
        console.log(this._account);
        return this._account;
    }
}
