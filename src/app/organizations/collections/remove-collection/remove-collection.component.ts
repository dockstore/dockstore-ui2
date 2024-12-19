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
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CollectionsService } from '../../state/collections.service';
import { CollectionsQuery } from '../../state/collections.query';
import { AsyncPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { AlertComponent } from '../../../shared/alert/alert.component';

@Component({
  selector: 'app-collection-confirm-remove',
  templateUrl: './remove-collection.component.html',
  standalone: true,
  imports: [MatDialogModule, AlertComponent, FlexModule, MatButtonModule, MatTooltipModule, AsyncPipe],
})
export class RemoveCollectionDialogComponent {
  public collectionsQueryLoading$: Observable<boolean>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CollectionDialogData,
    private collectionsService: CollectionsService,
    private collectionsQuery: CollectionsQuery
  ) {
    this.collectionsQueryLoading$ = this.collectionsQuery.selectLoading();
  }
  removeCollection() {
    this.collectionsService.deleteCollection(
      this.data.organizationId,
      this.data.collectionId,
      this.data.organizationName,
      this.data.collectionName
    );
  }
}

export interface CollectionDialogData {
  organizationId: number;
  collectionId: number;
  organizationName: string;
  collectionName: string;
}
