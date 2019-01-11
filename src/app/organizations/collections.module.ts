import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatCardModule, MatDialogModule, MatExpansionModule } from '@angular/material';

import { CollectionsComponent } from './collections/collections.component';
import { CreateCollectionModule } from './collections/create-collection.module';

@NgModule({
  imports: [
    CommonModule,
    CreateCollectionModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule],
  declarations: [CollectionsComponent],
  exports: [CollectionsComponent]
})
export class CollectionsModule { }
