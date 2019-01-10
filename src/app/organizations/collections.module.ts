import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule, MatExpansionModule } from '@angular/material';

import { CollectionsComponent } from './collections/collections.component';
import { CreateCollectionModule } from './collections/create-collection.module';

@NgModule({
  imports: [ CommonModule, CreateCollectionModule, MatButtonModule, MatDialogModule, MatExpansionModule ],
  declarations: [ CollectionsComponent ],
  exports: [ CollectionsComponent ]
})
export class CollectionsModule { }
