import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MapFriendlyValuesPipe } from '../../search/map-friendly-values.pipe';
import { ExpandPanelPipe } from '../entry/expand-panel.pipe';
import { SelectTabPipe } from '../entry/select-tab.pipe';
import { TimeAgoMsgPipe } from '../../organizations/organization/time-ago-msg.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ExpandPanelPipe,
    MapFriendlyValuesPipe,
    SelectTabPipe,
    TimeAgoMsgPipe
  ],
  exports: [
    ExpandPanelPipe,
    MapFriendlyValuesPipe,
    SelectTabPipe,
    TimeAgoMsgPipe
  ],
})
export class PipeModule { }
