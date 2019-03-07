import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AliasesStore, AliasesState } from './aliases.store';

@Injectable({ providedIn: 'root' })
export class AliasesQuery extends Query<AliasesState> {
  organization$ = this.select(state => state.organization);
  collection$ = this.select(state => state.collection);
  loading$ = this.selectLoading();

  constructor(protected store: AliasesStore) {
    super(store);
  }

}
