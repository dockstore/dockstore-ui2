import { Injectable } from '@angular/core';
import { QueryEntity, HashMap } from '@datorama/akita';
import { CollectionsStore, CollectionsState } from './collections.store';
import { Collection } from '../../shared/swagger';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollectionsQuery extends QueryEntity<CollectionsState, Collection> {
  loading$: Observable<boolean> = this.selectLoading();
  error$: Observable<boolean> = this.selectError();
  collections$: Observable<HashMap<Collection>> = this.select(state => state.entities);
  constructor(protected store: CollectionsStore) {
    super(store);
  }
}
