import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { CustomMaterialModule } from '../shared/modules/material.module';
import { CurrentCollectionsComponent } from './current-collections/current-collections.component';

@NgModule({
  imports: [CommonModule, CustomMaterialModule, FlexLayoutModule, RouterModule],
  declarations: [CurrentCollectionsComponent],
  exports: [CurrentCollectionsComponent]
})
export class CurrentCollectionsModule {}
