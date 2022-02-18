import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

import { MarkdownModule } from 'ngx-markdown';
import { CategoryButtonModule } from '../categories/button/category-button.module';
import { RefreshAlertModule } from '../shared/alert/alert.module';
import { HeaderModule } from '../shared/modules/header.module';
import { ImgFallbackModule } from '../shared/modules/img-fallback.module';
import { MarkdownWrapperModule } from '../shared/modules/markdown-wrapper.module';
import { CustomMaterialModule } from '../shared/modules/material.module';
import { PipeModule } from '../shared/pipe/pipe.module';
import { CollectionComponent, CollectionRemoveEntryDialogComponent } from './collection/collection.component';
import { CollectionsComponent } from './collections/collections.component';
import { CreateCollectionModule } from './collections/create-collection.module';
import { RemoveCollectionDialogComponent } from './collections/remove-collection/remove-collection.component';
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
    MarkdownModule,
    UpdateOrganizationDescriptionModule,
    MarkdownWrapperModule,
    CategoryButtonModule,
    ImgFallbackModule,
    PipeModule,
  ],
  declarations: [CollectionsComponent, CollectionComponent, CollectionRemoveEntryDialogComponent, RemoveCollectionDialogComponent],
  exports: [CollectionsComponent, CollectionComponent],
})
export class CollectionsModule {}
