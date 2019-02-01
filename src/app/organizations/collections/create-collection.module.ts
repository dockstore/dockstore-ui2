import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressBarModule,
  MatTooltipModule,
} from '@angular/material';

import { RefreshAlertModule } from '../../shared/alert/alert.module';
import { CreateCollectionComponent } from './create-collection/create-collection.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatTooltipModule,
    ReactiveFormsModule,
    RefreshAlertModule
  ],
  declarations: [CreateCollectionComponent],
  entryComponents: [CreateCollectionComponent]
})
export class CreateCollectionModule { }
