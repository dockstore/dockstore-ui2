import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class StarentryService {
  private starEntrySource = new BehaviorSubject<any>(null);
  starEntry$ = this.starEntrySource.asObservable();
  constructor() { }
  setEntry(entry: any) {
    this.starEntrySource.next(entry);
  }
}
