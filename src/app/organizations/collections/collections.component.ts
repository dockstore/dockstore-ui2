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
import { KeyValue, NgIf, NgFor, AsyncPipe, JsonPipe, KeyValuePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { HashMap } from '@datorama/akita';
import { Observable } from 'rxjs';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { Collection } from '../../shared/openapi';
import { CollectionsQuery } from '../state/collections.query';
import { CollectionsService } from '../state/collections.service';
import { OrganizationQuery } from '../state/organization.query';
import { CreateCollectionComponent } from './create-collection/create-collection.component';
import { Dockstore } from '../../shared/dockstore.model';
import { RouterLink } from '@angular/router';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatLegacyButtonModule,
    MatLegacyTooltipModule,
    MatIconModule,
    LoadingComponent,
    MatLegacyCardModule,
    FlexModule,
    NgFor,
    RouterLink,
    AsyncPipe,
    JsonPipe,
    KeyValuePipe,
  ],
})
export class CollectionsComponent implements OnInit, OnChanges {
  public Dockstore = Dockstore;
  @Input() organizationID: number;
  @Input() organizationName: string;
  loading$: Observable<boolean>;
  canEdit$: Observable<boolean>;
  canDelete$: Observable<boolean>;
  collections$: Observable<HashMap<Collection>>;
  constructor(
    private collectionsQuery: CollectionsQuery,
    private organizationQuery: OrganizationQuery,
    private collectionsService: CollectionsService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loading$ = this.collectionsQuery.loading$;
    this.canEdit$ = this.organizationQuery.canEdit$;
    this.canDelete$ = this.organizationQuery.canDeleteCollection$;
    this.collections$ = this.collectionsQuery.collections$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.collectionsService.clearState();
    this.collectionsService.updateCollections(this.organizationID);
  }

  editCollection(collection: KeyValue<string, Collection>) {
    this.matDialog.open(CreateCollectionComponent, { data: { collection: collection, mode: TagEditorMode.Edit }, width: '600px' });
  }

  createCollection() {
    this.matDialog.open(CreateCollectionComponent, { data: { collection: null, mode: TagEditorMode.Add }, width: '600px' });
  }
}
