import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CurrentCollectionsQuery } from '../../../entry/state/current-collections.query';
import { Collection, CollectionOrganization, OrganisationUser } from '../../../shared/swagger';
import { AddEntryState, AddEntryStore } from './add-entry.store';

@Injectable({ providedIn: 'root' })
export class AddEntryQuery extends Query<AddEntryState> {
  memberships$: Observable<Array<OrganisationUser>> = this.select(state => state.memberships);
  collections$: Observable<Array<Collection>> = this.select(state => state.collections);
  filteredCollections$: Observable<Array<Collection>> = combineLatest(this.collections$, this.currentCollectionsQuery.selectAll())
    .pipe(map(([collections, collectionOrganisation]) => this.filteredCollections(collections, collectionOrganisation)));
  isLoading$: Observable<boolean> = this.selectLoading();
  constructor(protected store: AddEntryStore, private currentCollectionsQuery: CurrentCollectionsQuery) {
    super(store);
  }

  filteredCollections(collections: Array<Collection>, collectionOrganisations: Array<CollectionOrganization>): Array<Collection> {
    if (collections) {
    return collections.
      filter(collection => !collectionOrganisations.some(collectionOrganisation => collectionOrganisation.collection.id === collection.id));
    } else {
      return null;
    }
  }
}
