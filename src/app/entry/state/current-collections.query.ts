import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { map } from 'rxjs/operators';
import { CollectionOrganization } from '../../shared/swagger';
import { CurrentCollectionsState, CurrentCollectionsStore } from './current-collections.store';

@Injectable({
  providedIn: 'root'
})
export class CurrentCollectionsQuery extends QueryEntity<CurrentCollectionsState, CollectionOrganization> {
  currentCollectionOrganizations$ = this.selectAll().pipe(map((collectionOrganizations: Array<CollectionOrganization>) => {
    collectionOrganizations.sort((a, b) => this.sortCollectionOrganizations(a, b));
    return collectionOrganizations;
  }));
  currentCollections$ = this.currentCollectionOrganizations$.pipe(
    map(collectionOrganizations => collectionOrganizations.map(collectionOrganization => collectionOrganization.collection)));
  constructor(protected store: CurrentCollectionsStore) {
    super(store);
  }

  sortCollectionOrganizations(a: CollectionOrganization, b: CollectionOrganization): number {
    if (a.organization.name < b.organization.name) {
      return -1;
    }
    if (a.organization.name > b.organization.name) {
      return 1;
    }
    return a.collection.name < b.collection.name ? -1 : 1;
  }
}
