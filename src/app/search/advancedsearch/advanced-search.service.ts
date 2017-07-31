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
    constructor() { }

    setAdvancedSearch(advancedSearch: AdvancedSearchObject) {
        this.advancedSearch$.next(advancedSearch);
    }
}
