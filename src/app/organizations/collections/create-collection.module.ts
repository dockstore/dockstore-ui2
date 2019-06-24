import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { RefreshAlertModule } from '../../shared/alert/alert.module';
import { CustomMaterialModule } from '../../shared/modules/material.module';
import { CreateCollectionComponent } from './create-collection/create-collection.component';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, CustomMaterialModule, ReactiveFormsModule, RefreshAlertModule],
  declarations: [CreateCollectionComponent],
  entryComponents: [CreateCollectionComponent]
})
export class CreateCollectionModule {}
