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

    search(): void {
        this.toAdvanceSearch$.next(true);
    }

}
