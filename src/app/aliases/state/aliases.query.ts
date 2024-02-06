import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AliasesState, AliasesStore } from './aliases.store';

@Injectable({ providedIn: 'root' })
export class AliasesQuery extends Query<AliasesState> {
  organization$ = this.select((state) => state.organization);
  collection$ = this.select((state) => state.collection);
  entry$ = this.select((state) => state.entry);
  workflowVersionPathInfo$ = this.select((state) => state.workflowVersionPathInfo);
  loading$ = this.selectLoading();

  constructor(protected store: AliasesStore) {
    super(store);
  }
}
