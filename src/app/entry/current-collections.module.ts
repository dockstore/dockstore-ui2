import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { ImgFallbackModule } from '../shared/modules/img-fallback.module';
import { CustomMaterialModule } from '../shared/modules/material.module';
import { PipeModule } from '../shared/pipe/pipe.module';
import { CurrentCollectionsComponent } from './current-collections/current-collections.component';

@NgModule({
  imports: [CommonModule, CustomMaterialModule, FlexLayoutModule, RouterModule, ImgFallbackModule, PipeModule],
  declarations: [CurrentCollectionsComponent],
  exports: [CurrentCollectionsComponent],
})
export class CurrentCollectionsModule {}
