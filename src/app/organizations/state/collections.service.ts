/*
 *    Copyright 2019 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ID, transaction } from '@datorama/akita';
import { finalize } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { OrganizationsService } from '../../shared/swagger';
import { Collection, OrganizationsService as OpenApiOrganizationsService } from '../../shared/openapi';
import { CollectionsQuery } from './collections.query';
import { CollectionsStore } from './collections.store';
import { OrganizationQuery } from './organization.query';
import { OrganizationService } from './organization.service';

@Injectable({ providedIn: 'root' })
export class CollectionsService {
  constructor(
    private collectionsStore: CollectionsStore,
    private organizationsService: OrganizationsService,
    private openApiOrganizationsService: OpenApiOrganizationsService,
    private alertService: AlertService,
    private organizationService: OrganizationService,
    private organizationStore: OrganizationQuery,
    private collectionsQuery: CollectionsQuery,
    private matDialog: MatDialog,
    private router: Router
  ) {}

  clearState() {
    this.collectionsStore.remove();
  }

  // Get function
  updateCollections(organizationID?: number) {
    if (!organizationID) {
      organizationID = this.organizationStore.getValue().organization.id;
    }
    this.collectionsStore.setLoading(true);
    const activeId: ID = this.collectionsQuery.getActiveId();
    this.collectionsStore.remove();
    this.organizationsService
      .getCollectionsFromOrganization(organizationID)
      .pipe(finalize(() => this.collectionsStore.setLoading(false)))
      .subscribe(
        (collections: Array<Collection>) => {
          this.collectionsStore.remove();
          this.addAll(collections);
          if (activeId) {
            this.updateCollectionFromId(organizationID, activeId as number);
          }
        },
        (error) => {
          console.error(error);
          this.collectionsStore.setError(true);
        }
      );
  }

  add(collection: Collection) {
    this.collectionsStore.add(collection);
  }

  addAll(collections: Array<Collection>) {
    this.collectionsStore.add(collections);
  }

  update(id, collection: Partial<Collection>) {
    this.collectionsStore.update(id, collection);
  }

  remove(id: ID) {
    this.collectionsStore.remove(id);
  }

  @transaction()
  updateCollectionFromName(organizationName: string, collectionName: string) {
    this.collectionsStore.setError(false);
    this.collectionsStore.setLoading(true);
    this.organizationsService
      .getCollectionByName(organizationName, collectionName)
      .pipe(finalize(() => this.collectionsStore.setLoading(false)))
      .subscribe(
        (collection: Collection) => {
          this.collectionsStore.setError(false);
          this.collectionsStore.upsert(collection.id, collection);
          this.collectionsStore.setActive(collection.id);
          this.organizationService.updateOrganizationFromID(collection.organizationID);
        },
        (error: HttpErrorResponse) => {
          this.collectionsStore.setError(true);
          if (error.status === 404) {
            this.router.navigate(['page-not-found']);
          }
        }
      );
  }

  /**
   * Currently only used from the collection page
   * Grabs detailed collection information and navigates to the collection's page
   *
   * @param {number} organizationId  The ID of the organization that the collection belongs to
   * @param {number} collectionId  The ID of the collection
   * @memberof CollectionsService
   */
  @transaction()
  updateCollectionFromId(organizationId: number, collectionId: number) {
    this.collectionsStore.setError(false);
    this.collectionsStore.setLoading(true);
    this.organizationsService
      .getCollectionById(organizationId, collectionId)
      .pipe(finalize(() => this.collectionsStore.setLoading(false)))
      .subscribe(
        (collection: Collection) => {
          this.collectionsStore.setError(false);
          this.collectionsStore.upsert(collection.id, collection);
          this.collectionsStore.setActive(collection.id);
          this.organizationService.updateOrganizationFromID(collection.organizationID);
          // Navigate to the new collectionName in case the name changes.
          this.router.navigate(['/organizations', collection.organizationName, 'collections', collection.name]);
        },
        () => {
          this.collectionsStore.setError(true);
        }
      );
  }

  /**
   * Removes the given entry from the collection for the given organization
   * @param organizationId
   * @param collectionId
   * @param entryId
   * @param entryName
   */
  removeEntryFromCollection(organizationId: number, collectionId: number, entryId: number, entryName: string, versionName: string | null) {
    this.alertService.start('Removing entry ' + entryName);
    this.organizationsService
      .deleteEntryFromCollection(organizationId, collectionId, entryId, versionName)
      .pipe(finalize(() => this.collectionsStore.setLoading(false)))
      .subscribe(
        (collection: Collection) => {
          this.alertService.simpleSuccess();
          this.updateCollectionFromId(organizationId, collectionId);
          this.matDialog.closeAll();
        },
        () => {
          this.collectionsStore.setError(true);
          this.alertService.simpleError();
        }
      );
  }

  /**
   * Deletes the specified collection
   * @param organizationId
   * @param collectionId
   * @param organizationName
   * @param collectionName
   */
  deleteCollection(organizationId: number, collectionId: number, organizationName: string, collectionName: string) {
    // Implement the store setLoading/Error and alertService calls per the recommendations here:
    // https://github.com/dockstore/dockstore/wiki/Dockstore-Frontend-Opinionated-Style-Guide#notifications-user-feedback
    this.collectionsStore.setLoading(true);
    this.collectionsStore.setError(false);
    this.alertService.start('Removing collection ' + collectionName);
    this.openApiOrganizationsService.deleteCollection(organizationId, collectionId).subscribe(
      () => {
        this.collectionsStore.setLoading(false);
        this.collectionsStore.setError(false);
        this.alertService.detailedSuccess();
        this.matDialog.closeAll();
        // Update and display the org page.
        // There are at least two reasonable places for a delete collection button to appear in our UI:
        // 1) on the collection page
        // 2) on each collection summary on the org page
        // So, this delete might have been invoked from the org page, and we're there already. Or not.
        // Gracefully handle both cases, so that no matter how the UI evolves, this function works properly:
        if (this.router.url.endsWith('/organizations/' + organizationName)) {
          // We're already on the organization page.
          // A router.navigate to the current page won't trigger the org component ngOnInit to update the state.
          // Update the state manually.
          this.updateCollections(organizationId);
          // Organization has a collectionsLength property so we update it, too.
          this.organizationService.updateOrganizationFromID(organizationId);
        } else {
          // Navigate to the organization page.
          // Router.navigate will trigger the org component ngOnInit, which updates the necessary state.
          this.router.navigate(['/organizations', organizationName]);
        }
      },
      (error: HttpErrorResponse) => {
        this.collectionsStore.setLoading(false);
        this.collectionsStore.setError(true);
        this.alertService.detailedError(error);
      }
    );
  }
}
