import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CollectionOrganization } from '../../shared/swagger';
import { CurrentCollectionsState, CurrentCollectionsStore } from './current-collections.store';

@Injectable({
  providedIn: 'root',
})
export class CurrentCollectionsQuery extends QueryEntity<CurrentCollectionsState, CollectionOrganization> {
  currentCollectionOrganizations$ = this.selectAll().pipe(
    map((collectionOrganizations: Array<CollectionOrganization>) => {
      collectionOrganizations.sort((a, b) => this.sortCollectionOrganizations(a, b));
      return collectionOrganizations;
    })
  );
  currentCollectionIds$: Observable<Array<number>> = this.currentCollectionOrganizations$.pipe(
    map((collectionOrganizations) => collectionOrganizations.map((collectionOrganization) => collectionOrganization.collectionId))
  );
  constructor(protected store: CurrentCollectionsStore) {
    super(store);
  }

  sortCollectionOrganizations(a: CollectionOrganization, b: CollectionOrganization): number {
    if (a.organizationName.toLowerCase() < b.organizationName.toLowerCase()) {
      return -1;
    }
    if (a.organizationName.toLowerCase() > b.organizationName.toLowerCase()) {
      return 1;
    }
    return a.collectionName.toLowerCase() < b.collectionName.toLowerCase() ? -1 : 1;
  }
}
