import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionOrganization } from '../../shared/swagger';

export interface CurrentCollectionsState extends EntityState<CollectionOrganization> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'current-collections', idKey: 'collectionId' })
export class CurrentCollectionsStore extends EntityStore<CurrentCollectionsState, CollectionOrganization> {
  constructor() {
    super();
  }
}
