import { Injectable } from '@angular/core';
import { AddEntryStore, AddEntryState } from './add-entry.store';
import { OrganisationsService, UsersService, OrganisationUser, Collection } from '../../../shared/swagger';
import { finalize } from 'rxjs/operators';
import { AlertService } from '../../../shared/alert/state/alert.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AddEntryService {

  constructor(private addEntryStore: AddEntryStore,
    private organisationsService: OrganisationsService,
    private usersService: UsersService, private alertService: AlertService) {
  }

  /**
   * Updates the set of memberships for the logged in user
   */
  updateMemberships(): void {
    this.beforeCall();
    this.usersService.getUserMemberships().pipe(
      finalize(() => this.addEntryStore.setLoading(false)
      ))
      .subscribe((memberships: Array<OrganisationUser>) => {
        this.updateMembershipsState(memberships);
        this.addEntryStore.setError(false);
      }, () => {
        this.updateMembershipsState(null);
        this.addEntryStore.setError(true);
      });
  }

  /**
   * Updates the memberships state
   * @param memberships
   */
  updateMembershipsState(memberships: Array<OrganisationUser>): void {
    this.addEntryStore.setState((state: AddEntryState) => {
      return {
        ...state,
        memberships: memberships
      };
    });
  }

  beforeCall() {
    this.addEntryStore.setLoading(true);
    this.addEntryStore.setError(false);
  }

  /**
   * Updates the set of collections for the given organisation
   * @param orgId Id of organisation to grab collections
   */
  updateCollections(orgId: number): void {
    this.beforeCall();
    this.organisationsService.getCollectionsFromOrganisation(orgId).pipe(
      finalize(() => this.addEntryStore.setLoading(false)
      ))
      .subscribe((collections: Array<Collection>) => {
        this.updateCollectionsState(collections);
        this.addEntryStore.setError(false);
      }, () => {
        this.updateCollectionsState(null);
        this.addEntryStore.setError(true);
      });
  }

  /**
   * Updates the collections state
   * @param collections
   */
  updateCollectionsState(collections: Array<Collection>): void {
    this.addEntryStore.setState((state: AddEntryState) => {
      return {
        ...state,
        collections: collections
      };
    });
  }

  /**
   * Adds an entry to the given collection
   * @param organisationId
   * @param collectionId
   * @param entryId
   */
  addEntryToCollection(organisationId: number, collectionId: number, entryId: number): void {
    this.alertService.start('Adding to collection');
    this.organisationsService.addEntryToCollection(organisationId, collectionId, entryId).pipe(
      finalize(() => this.addEntryStore.setLoading(false)
      ))
      .subscribe((collection: Collection) => {
        this.alertService.detailedSuccess();
      }, (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
        this.addEntryStore.setError(true);
      });
  }

}
