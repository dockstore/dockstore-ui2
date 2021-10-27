/*
 * Copyright 2021 OICR and UCSC
 *
 * Licensed under the Apache License, Version 2.0 (the &quot;License&quot;);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an &quot;AS IS&quot; BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CollectionsService } from '../../state/collections.service';

@Component({
  selector: 'app-collection-confirm-remove',
  templateUrl: './remove-collection.component.html',
})
export class RemoveCollectionDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: CollectionDialogData, private collectionsService: CollectionsService) {}
  removeCollection() {
    this.collectionsService.deleteCollection(this.data.organizationId, this.data.collectionId, this.data.organizationName, this.data.collectionName);
  }
}

export interface CollectionDialogData {
  organizationId: number;
  collectionId: number;
  organizationName: string;
  collectionName: string;
}
