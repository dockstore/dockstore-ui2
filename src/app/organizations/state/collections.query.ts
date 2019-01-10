import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { CollectionsStore, CollectionsState } from './collections.store';

@Injectable({ providedIn: 'root' })
export class CollectionsQuery extends Query<CollectionsState> {
  loading$ = this.selectLoading();
  error$ = this.selectError();
  constructor(protected store: CollectionsStore) {
    super(store);
  }

}
