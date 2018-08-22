import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MapFriendlyValuesPipe } from '../../search/map-friendly-values.pipe';
import { ExpandPanelPipe } from '../entry/expand-panel.pipe';
import { SelectTabPipe } from '../entry/select-tab.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ExpandPanelPipe,
    MapFriendlyValuesPipe,
    SelectTabPipe
  ],
  exports: [
    ExpandPanelPipe,
    MapFriendlyValuesPipe,
    SelectTabPipe
  ],
})
export class PipeModule { }
