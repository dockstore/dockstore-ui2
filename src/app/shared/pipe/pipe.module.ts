import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FilePathPipe } from '../../entry/file-path.pipe';
import { RouterLinkPipe } from '../../entry/router-link.pipe';
import { GravatarPipe } from '../../gravatar/gravatar.pipe';
import { TimeAgoMsgPipe } from '../../organizations/organization/time-ago-msg.pipe';
import { GetFacetSearchUpdatePipe } from '../../search/facet-search/facet-search-update.pipe';
import { GetFacetSearchResultsPipe } from '../../search/facet-search/facet-search.pipe';
import { GetHistogramStylePipe } from '../../search/get-histogram-style.pipe';
import { MapFriendlyValuesPipe } from '../../search/map-friendly-values.pipe';
import { SelectTabPipe } from '../entry/select-tab.pipe';
import { BaseUrlPipe } from '../entry/base-url.pipe';
import { MethodPipe } from './function-pipes';
import { FunctionPipe } from './function-pipes';

const DECLARATIONS: any[] = [
  FilePathPipe,
  MapFriendlyValuesPipe,
  SelectTabPipe,
  TimeAgoMsgPipe,
  GetHistogramStylePipe,
  GetFacetSearchResultsPipe,
  GetFacetSearchUpdatePipe,
  GravatarPipe,
  RouterLinkPipe,
  BaseUrlPipe,
  MethodPipe,
  FunctionPipe,
];
@NgModule({
  imports: [CommonModule],
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
})
export class PipeModule {}
