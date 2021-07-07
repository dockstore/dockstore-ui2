import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FilePathPipe } from '../../entry/file-path.pipe';
import { TimeAgoMsgPipe } from '../../organizations/organization/time-ago-msg.pipe';
import { GetFacetSearchUpdatePipe } from '../../search/facet-search/facet-search-update.pipe';
import { GetFacetSearchResultsPipe } from '../../search/facet-search/facet-search.pipe';
import { GetHistogramWidthPipe } from '../../search/get-histogram-width.pipe';
import { MapFriendlyValuesPipe } from '../../search/map-friendly-values.pipe';
import { SelectTabPipe } from '../entry/select-tab.pipe';

const DECLARATIONS: any[] = [
  FilePathPipe,
  MapFriendlyValuesPipe,
  SelectTabPipe,
  TimeAgoMsgPipe,
  GetHistogramWidthPipe,
  GetFacetSearchResultsPipe,
  GetFacetSearchUpdatePipe,
];
@NgModule({
  imports: [CommonModule],
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
})
export class PipeModule {}
