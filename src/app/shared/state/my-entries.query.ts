import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Observable } from 'rxjs';
import { MyEntriesState, MyEntriesStore } from './my-entries.store';

@Injectable()
export class MyEntriesQuery extends Query<MyEntriesState> {
  refreshingMyEntries$: Observable<boolean> = this.select((state) => state.refreshingMyEntries);
  constructor(protected store: MyEntriesStore) {
    super(store);
  }
}
