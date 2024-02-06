import { Injectable } from '@angular/core';
import { HashMap, QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { Collection } from '../../shared/openapi';
import { CollectionsState, CollectionsStore } from './collections.store';

@Injectable({
  providedIn: 'root',
})
export class CollectionsQuery extends QueryEntity<CollectionsState, Collection> {
  loading$: Observable<boolean> = this.selectLoading();
  error$: Observable<boolean> = this.selectError();
  collections$: Observable<HashMap<Collection>> = this.select((state) => state.entities);
  constructor(protected store: CollectionsStore) {
    super(store);
  }
}
