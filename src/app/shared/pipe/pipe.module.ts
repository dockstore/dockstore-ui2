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
import { DescriptorLanguageVersionsPipe } from '../entry/descriptor-language-versions.pipe';
import { DescriptorLanguagePipe } from '../entry/descriptor-language.pipe';
import { RecentEventsPipe } from '../entry/recent-events.pipe';
import { EntryToDisplayNamePipe } from '../entry-to-display-name.pipe';
import { SearchAuthorsHtmlPipe } from 'app/search/search-authors-html.pipe';
import { PlatformPartnerPipe } from '../entry/platform-partner.pipe';
import { JoinWithEllipsesPipe } from 'app/search/join-with-ellipses.pipe';
import { SecondsToHoursMinutesSecondsPipe } from 'app/workflow/executions/seconds-to-hours-minutes-seconds.pipe';

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
  DescriptorLanguageVersionsPipe,
  DescriptorLanguagePipe,
  RecentEventsPipe,
  SearchAuthorsHtmlPipe,
  PlatformPartnerPipe,
  JoinWithEllipsesPipe,
  SecondsToHoursMinutesSecondsPipe,
];
@NgModule({
  imports: [CommonModule],
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
  providers: [EntryToDisplayNamePipe, PlatformPartnerPipe, MapFriendlyValuesPipe],
})
export class PipeModule {}
