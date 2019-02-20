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
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ID, transaction } from '@datorama/akita';
import { finalize } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { Collection, OrganizationsService } from '../../shared/swagger';
import { CollectionsQuery } from './collections.query';
import { CollectionsStore } from './collections.store';
import { OrganizationQuery } from './organization.query';
import { OrganizationService } from './organization.service';

@Injectable({ providedIn: 'root' })
export class CollectionsService {

  constructor(private collectionsStore: CollectionsStore, private organizationsService: OrganizationsService,
    private alertService: AlertService, private organizationService: OrganizationService,
    private organizationStore: OrganizationQuery, private collectionsQuery: CollectionsQuery,
    private matDialog: MatDialog) {
  }

  clearState() {
    this.collectionsStore.remove();
  }

  // Get function
  updateCollections(organizationID?: number) {
    if (!organizationID) {
      organizationID = this.organizationStore.getSnapshot().organization.id;
    }
    this.collectionsStore.setLoading(true);
    const activeId: ID = this.collectionsQuery.getActiveId();
    this.collectionsStore.remove();
    this.organizationsService.getCollectionsFromOrganization(organizationID).pipe(
      finalize(() => this.collectionsStore.setLoading(false)))
      .subscribe((collections: Array<Collection>) => {
        this.addAll(collections);
        if (activeId) {
          this.updateCollectionFromName(organizationID.toString(), activeId.toString());
        }
      }, error => {
        console.error(error);
        this.collectionsStore.setError(true);
      });
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
  updateCollectionFromName(organizationIdString: string, collectionIdString: string) {
    const organizationId: number = parseInt(organizationIdString, 10);
    const collectionId: number = parseInt(collectionIdString, 10);
    if (isNaN(organizationId)) {
      console.error('Organization name (instead of ID) currently not handled');
      return;
    }
    this.collectionsStore.setError(false);
    this.collectionsStore.setLoading(true);
    this.organizationsService.getCollectionById(organizationId, collectionId).pipe(finalize(() => this.collectionsStore.setLoading(false)))
      .subscribe((collection: Collection) => {
        this.collectionsStore.setError(false);
        this.collectionsStore.createOrReplace(collection.id, collection);
        this.collectionsStore.setActive(collection.id);
      }, () => {
        this.collectionsStore.setError(true);
      });
  }

  /**
   * Removes the given entry from the collection for the given organization
   * @param organizationId
   * @param collectionId
   * @param entryId
   * @param entryName
   */
  removeEntryFromCollection(organizationId: number, collectionId: number, entryId: number, entryName: string) {
    this.alertService.start('Removing entry ' + entryName);
    this.organizationsService.deleteEntryFromCollection(organizationId, collectionId, entryId).pipe(
      finalize(() => this.collectionsStore.setLoading(false)
      ))
      .subscribe((collection: Collection) => {
        this.alertService.simpleSuccess();
        this.updateCollectionFromName(organizationId.toString(), collectionId.toString());
        this.matDialog.closeAll();
      }, () => {
        this.collectionsStore.setError(true);
        this.alertService.simpleError();
      });
  }
}
