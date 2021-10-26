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
import { Collection, OrganizationsService } from '../../shared/swagger';
import { OrganizationsService as OpenApiOrganizationsService } from '../../shared/openapi';
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
        () => {
          this.collectionsStore.setError(true);
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
    this.alertService.start('Removing collection ' + collectionName);
    // In some cases, similar existing functions do not set the collectionStore loading/error flags, either before or after.
    // Gary's advice regarding setting the collectionStore flags is as follows:
    //  "so before the http request, set flags. on success set flags,
    //   on fail, set flags. if the success calls another function that
    //   makes another http request, probably set flags inside that
    //   function instead of the first's success"
    // We implement the above advice:
    this.collectionsStore.setLoading(true);
    this.collectionsStore.setError(false);
    this.openApiOrganizationsService
      .deleteCollection(organizationId, collectionId)
      .subscribe(
        () => {
          this.alertService.detailedSuccess();
          this.matDialog.closeAll();
          this.updateCollections(organizationId);
          this.organizationService.updateOrganizationFromID(organizationId); // Organization has a collectionsLength property so we update it.
          this.router.navigate(['/organizations', organizationName]);
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
          this.collectionsStore.setLoading(false);
          this.collectionsStore.setError(true);
        }
      );
  }
}
