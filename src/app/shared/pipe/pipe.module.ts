import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GithubNameToIdPipe } from 'app/github-name-to-id.pipe';
import { TimeAgoMsgPipe } from '../../organizations/organization/time-ago-msg.pipe';
import { MapFriendlyValuesPipe } from '../../search/map-friendly-values.pipe';
import { ExpandPanelPipe } from '../entry/expand-panel.pipe';
import { SelectTabPipe } from '../entry/select-tab.pipe';

const DECLARATIONS: any[] = [ExpandPanelPipe, MapFriendlyValuesPipe, SelectTabPipe, TimeAgoMsgPipe, GithubNameToIdPipe];
@NgModule({
  imports: [CommonModule],
  declarations: DECLARATIONS,
  exports: DECLARATIONS
})
export class PipeModule {}
