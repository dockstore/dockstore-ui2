import { BehaviorSubject ,  Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ExpandService {

constructor() { }
    expandAll$: Subject<boolean> = new BehaviorSubject<boolean>(true);

    public setExpandAll(expandAll: boolean) {
        this.expandAll$.next(expandAll);
    }
}
