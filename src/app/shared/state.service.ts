import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

/**
 * This class contains observables hold the global state of the website.
 * This includes variables that can't possibly have two values at the same time.
 * For example, the 'refreshing' boolean variable indicates whether the current being viewed is being refreshed
 * @export
 * @class StateService
 */
@Injectable()
export class StateService {
    refreshing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    constructor() { }

    setRefreshing(refreshing: boolean) {
        this.refreshing.next(refreshing);
    }
}
