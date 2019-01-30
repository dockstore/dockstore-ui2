import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionComponent, CollectionRemoveEntryDialogComponent } from './collection/collection.component';
import { MatCardModule, MatProgressBarModule, MatIconModule, MatChipsModule, MatButtonModule, MatTooltipModule,
  MatDialogModule } from '@angular/material';
import { HeaderModule } from '../shared/modules/header.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [ CommonModule, HeaderModule,
  MatCardModule, MatProgressBarModule, MatIconModule,
  FlexLayoutModule, RouterModule, MatChipsModule, MatButtonModule,
  MatIconModule, MatTooltipModule, MatDialogModule ],
  declarations: [
    CollectionComponent,
    CollectionRemoveEntryDialogComponent
  ],
  exports: [
    CollectionComponent,
    CollectionRemoveEntryDialogComponent
  ],
  entryComponents: [
    CollectionRemoveEntryDialogComponent
  ]
})
export class CollectionModule { }
