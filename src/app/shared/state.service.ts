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
    publicPage$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    /**
     * This replaces the refreshing$ observable.
     * A truthy refreshMessage$ indicates that at least one entry is being refreshed
     * @type {BehaviorSubject<string>}
     * @memberof StateService
     */
    refreshMessage$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    constructor() { }

    setPublicPage(publicPage: boolean): void {
        this.publicPage$.next(publicPage);
    }

    setRefreshMessage(refreshMessage: string): void {
        this.refreshMessage$.next(refreshMessage);
    }
}
