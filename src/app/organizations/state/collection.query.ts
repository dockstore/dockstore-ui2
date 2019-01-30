import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { CollectionStore, CollectionState } from './collection.store';

@Injectable({ providedIn: 'root' })
export class CollectionQuery extends Query<CollectionState> {
  collection$ = this.select(state => state.collection);
  loading$ = this.selectLoading();
  constructor(protected store: CollectionStore) {
    super(store);
  }

}
