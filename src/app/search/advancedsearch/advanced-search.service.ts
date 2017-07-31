import { AdvancedSearchObject } from './../../shared/models/AdvancedSearchObject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

@Injectable()
export class AdvancedSearchService {
    advancedSearch$: BehaviorSubject<AdvancedSearchObject> = new BehaviorSubject<AdvancedSearchObject>({
        ANDSplitFilter: '',
        ANDNoSplitFilter: '',
        ORFilter: '',
        NOTFilter: '',
        toAdvanceSearch: false
    });
    showModal$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    constructor() { }

    setAdvancedSearch(advancedSearch: AdvancedSearchObject): void {
        this.advancedSearch$.next(advancedSearch);
    }

    setShowModal(showModal: boolean): void {
        this.showModal$.next(showModal);
    }
}
