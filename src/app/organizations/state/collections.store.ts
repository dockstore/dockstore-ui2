import { Injectable } from '@angular/core';
import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Collection } from '../../shared/openapi';

export interface CollectionsState extends EntityState<Collection>, ActiveState {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'collections' })
export class CollectionsStore extends EntityStore<CollectionsState, Collection> {
  constructor() {
    super();
  }
}
