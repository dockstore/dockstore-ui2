import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CurrentCollectionsQuery } from '../../../entry/state/current-collections.query';
import { Collection, OrganizationUser } from '../../../shared/swagger';
import { AddEntryState, AddEntryStore } from './add-entry.store';

@Injectable({ providedIn: 'root' })
export class AddEntryQuery extends Query<AddEntryState> {
  memberships$: Observable<Array<OrganizationUser>> = this.select(state => state.memberships);
  collections$: Observable<Array<Collection>> = this.select(state => state.collections);
  filteredCollections$: Observable<Array<Collection>> = combineLatest([
    this.collections$,
    this.currentCollectionsQuery.currentCollectionIds$
  ]).pipe(map(([collections, collectionOrganization]) => this.filteredCollections(collections, collectionOrganization)));
  isLoading$: Observable<boolean> = this.selectLoading();
  constructor(protected store: AddEntryStore, private currentCollectionsQuery: CurrentCollectionsQuery) {
    super(store);
  }

  /**
   * Filtered the collections of an organization to only the ones that can be added
   *
   * @param {Array<Collection>} collections  A specific organization's collections
   * @param {Array<CollectionOrganization>} existingCollections  The collection and organization the current entry already belongs to
   * @returns {Array<Collection>}  A filtered array of collections that the entry can be added to
   * @memberof AddEntryQuery
   */
  filteredCollections(collections: Array<Collection>, existingCollectionIds: Array<number>): Array<Collection> {
    if (collections) {
      return collections.filter(collection => !existingCollectionIds.some(existingCollectionId => existingCollectionId === collection.id));
    } else {
      return null;
    }
  }
}
