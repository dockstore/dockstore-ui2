import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { CurrentCollectionsService } from '../../../entry/state/current-collections.service';
import { AlertService } from '../../../shared/alert/state/alert.service';
import { Collection, OrganizationsService, OrganizationUser, UsersService } from '../../../shared/swagger';
import { AddEntryState, AddEntryStore } from './add-entry.store';

@Injectable({ providedIn: 'root' })
export class AddEntryService {
  constructor(
    private addEntryStore: AddEntryStore,
    private organizationsService: OrganizationsService,
    private usersService: UsersService,
    private alertService: AlertService,
    private currentCollectionsService: CurrentCollectionsService
  ) {}

  /**
   * Updates the set of memberships for the logged in user
   */
  updateMemberships(): void {
    this.beforeCall();
    this.usersService
      .getUserMemberships()
      .pipe(finalize(() => this.addEntryStore.setLoading(false)))
      .subscribe(
        (memberships: Array<OrganizationUser>) => {
          memberships = memberships.filter((membership) => membership.accepted && membership.role !== OrganizationUser.RoleEnum.MEMBER);
          this.updateMembershipsState(memberships);
          this.addEntryStore.setError(false);
        },
        () => {
          this.updateMembershipsState(null);
          this.addEntryStore.setError(true);
        }
      );
  }

  /**
   * Updates the memberships state
   * @param memberships
   */
  updateMembershipsState(memberships: Array<OrganizationUser>): void {
    this.addEntryStore.update((state: AddEntryState) => {
      return {
        ...state,
        memberships: memberships,
      };
    });
  }

  beforeCall() {
    this.addEntryStore.setLoading(true);
    this.addEntryStore.setError(false);
  }

  /**
   * Updates the set of collections for the given organization
   * @param orgId Id of organization to grab collections
   */
  updateCollections(orgId: number): void {
    this.beforeCall();
    this.organizationsService
      .getCollectionsFromOrganization(orgId)
      .pipe(finalize(() => this.addEntryStore.setLoading(false)))
      .subscribe(
        (collections: Array<Collection>) => {
          this.updateCollectionsState(collections);
          this.addEntryStore.setError(false);
        },
        () => {
          this.updateCollectionsState(null);
          this.addEntryStore.setError(true);
        }
      );
  }

  /**
   * Updates the collections state
   * @param collections
   */
  updateCollectionsState(collections: Array<Collection>): void {
    this.addEntryStore.update((state: AddEntryState) => {
      return {
        ...state,
        collections: collections,
      };
    });
  }

  /**
   * Adds an entry to the given collection
   * @param organizationId
   * @param collectionId
   * @param entryId
   */
  addEntryToCollection(organizationId: number, collectionId: number, entryId: number, versionId: number | null): void {
    this.alertService.start('Adding to collection');
    this.organizationsService
      .addEntryToCollection(organizationId, collectionId, entryId, versionId)
      .pipe(finalize(() => this.addEntryStore.setLoading(false)))
      .subscribe(
        (collection: Collection) => {
          this.alertService.detailedSuccess();
          this.currentCollectionsService.get(entryId);
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
          this.addEntryStore.setError(true);
        }
      );
  }
}
