/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

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
