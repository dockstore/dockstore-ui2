import { Injectable } from '@angular/core';
import { AddEntryStore, AddEntryState } from './add-entry.store';
import { OrganisationsService, UsersService, OrganisationUser, Collection } from '../../../shared/swagger';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AddEntryService {

  constructor(private addEntryStore: AddEntryStore,
    private organisationsService: OrganisationsService,
    private usersService: UsersService) {
  }

  updateMemberships(): void {
    this.usersService.getUserMemberships().pipe(
      finalize(() => this.addEntryStore.setLoading(false)
      ))
      .subscribe((memberships: Array<OrganisationUser>) => {
        this.updateMembershipsState(memberships);
      }, () => {
        this.updateMembershipsState(null);
        this.addEntryStore.setError(true);
      });
  }

  updateMembershipsState(memberships: Array<OrganisationUser>): void {
    this.addEntryStore.setState((state: AddEntryState) => {
      return {
        ...state,
        memberships: memberships
      };
    });
  }

  updateCollections(orgId: number): void {
    this.organisationsService.getCollectionsFromOrganisation(orgId).pipe(
      finalize(() => this.addEntryStore.setLoading(false)
      ))
      .subscribe((collections: Array<Collection>) => {
        this.updateCollectionsState(collections);
      }, () => {
        this.updateCollectionsState(null);
        this.addEntryStore.setError(true);
      });
  }

  updateCollectionsState(collections: Array<Collection>): void {
    this.addEntryStore.setState((state: AddEntryState) => {
      return {
        ...state,
        collections: collections
      };
    });
  }

  addEntryToCollection(organisationId: number, collectionId: number, entryId: number): void {
    this.organisationsService.addEntryToCollection(organisationId, collectionId, entryId).pipe(
      finalize(() => this.addEntryStore.setLoading(false)
      ))
      .subscribe((collection: Collection) => {
        console.log('Added to the collection');
      }, () => {
        this.addEntryStore.setError(true);
      });
  }

}
