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
import { ID } from '@datorama/akita';
import { HttpClient } from '@angular/common/http';
import { CollectionsStore } from './collections.store';
import { OrganisationsService, Collection } from '../../shared/swagger';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CollectionsService {

  constructor(private collectionsStore: CollectionsStore, private organisationsService: OrganisationsService,
              private http: HttpClient) {
  }

  // Get function
  updateCollections(organizationID: number) {
    this.collectionsStore.setLoading(true);
    this.organisationsService.getCollectionsFromOrganisation(organizationID).pipe(
      finalize(() => this.collectionsStore.setLoading(false)))
      .subscribe((collections: Array<Collection>) => {
        this.addAll(collections);
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
}
