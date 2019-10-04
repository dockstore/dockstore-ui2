import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MyEntriesState, MyEntriesStore } from './my-entries.store';

@Injectable()
export class MyEntriesQuery extends Query<MyEntriesState> {
  groupEntriesObject$: Observable<Array<any>> = this.select(state => state.groupEntriesObject);
  hasGroupEntriesObject$: Observable<boolean> = this.groupEntriesObject$.pipe(
    map(groupEntriesObject => {
      return groupEntriesObject && groupEntriesObject.length !== 0;
    })
  );
  refreshingMyEntries$: Observable<boolean> = this.select(state => state.refreshingMyEntries);
  constructor(protected store: MyEntriesStore) {
    super(store);
  }
}
