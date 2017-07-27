import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

@Injectable()
export class AdvancedSearchService {
    ANDSplitFilter$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    ANDNoSplitFilter$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    ORFilter$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    NOTFilter$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    toAdvanceSearch$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    constructor() { }

    setANDSplitFilter(ANDSplitFilter: string) {
        this.ANDSplitFilter$.next(ANDSplitFilter);
    }

    setANDNoSplitFilter(ANDNoSplitFilter: string) {
        this.ANDNoSplitFilter$.next(ANDNoSplitFilter);
    }

    setORFilter(ORFilter: string) {
        this.ORFilter$.next(ORFilter);
    }

    setNOTFilter(NOTFilter: string) {
        this.NOTFilter$.next(NOTFilter);
    }

    setToAdvanceSearch(toAdvanceSearch: boolean) {
        this.toAdvanceSearch$.next(toAdvanceSearch);
    }
}
