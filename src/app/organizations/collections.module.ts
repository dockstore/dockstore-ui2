import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

import { RefreshAlertModule } from '../shared/alert/alert.module';
import { HeaderModule } from '../shared/modules/header.module';
import { CustomMaterialModule } from '../shared/modules/material.module';
import { CollectionComponent, CollectionRemoveEntryDialogComponent } from './collection/collection.component';
import { CollectionsComponent } from './collections/collections.component';
import { CreateCollectionModule } from './collections/create-collection.module';
import { NgxMdModule } from 'ngx-md';
import { UpdateOrganizationDescriptionModule } from './organization/update-organization-description.module';

@NgModule({
  imports: [
    CommonModule,
    CreateCollectionModule,
    CustomMaterialModule,
    FlexLayoutModule,
    HeaderModule,
    RefreshAlertModule,
    RouterModule,
    NgxMdModule,
    UpdateOrganizationDescriptionModule
  ],
  declarations: [CollectionsComponent, CollectionComponent, CollectionRemoveEntryDialogComponent],
  exports: [CollectionsComponent, CollectionComponent],
  entryComponents: [CollectionRemoveEntryDialogComponent]
})
export class CollectionsModule { }
