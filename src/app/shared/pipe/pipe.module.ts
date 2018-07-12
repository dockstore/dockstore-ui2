import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MapFriendlyValuesPipe } from '../../search/map-friendly-values.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MapFriendlyValuesPipe],
  exports: [MapFriendlyValuesPipe]
})
export class PipeModule { }
