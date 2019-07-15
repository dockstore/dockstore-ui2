import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Collection } from '../../shared/swagger';

export interface CollectionsState extends EntityState<Collection> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'collections' })
export class CollectionsStore extends EntityStore<CollectionsState, Collection> {
  constructor() {
    super();
  }
}
