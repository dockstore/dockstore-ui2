import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { map } from 'rxjs/operators';
import { CollectionOrganization } from '../../shared/swagger';
import { CurrentCollectionsState, CurrentCollectionsStore } from './current-collections.store';

@Injectable({
  providedIn: 'root'
})
export class CurrentCollectionsQuery extends QueryEntity<CurrentCollectionsState, CollectionOrganization> {
  currentCollections$ = this.selectAll().pipe(map((collectionOrganizations: Array<CollectionOrganization>) => {
    collectionOrganizations.sort((a, b) => this.sortCollectionOrganizations(a, b));
    return collectionOrganizations;
  }));
  constructor(protected store: CurrentCollectionsStore) {
    super(store);
  }

  sortCollectionOrganizations(a: CollectionOrganization, b: CollectionOrganization): number {
    if (a.organization.name < b.organization.name) {
      return -1;
    } else {
      if (a.collection.name < b.collection.name) {
        return -1;
      } else {
        return 1;
      }
    }
  }
}
