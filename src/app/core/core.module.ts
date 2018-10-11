import { NgModule } from '@angular/core';

import { GA4GHFilesQuery } from '../shared/ga4gh-files/ga4gh-files.query';
import { GA4GHFilesService } from '../shared/ga4gh-files/ga4gh-files.service';
import { GA4GHFilesStore } from '../shared/ga4gh-files/ga4gh-files.store';
import { SessionQuery } from '../shared/session/session.query';
import { SessionService } from '../shared/session/session.service';
import { SessionStore } from '../shared/session/session.store';
import { ToolStore } from '../shared/tool/tool.store';
import { ToolQuery } from '../shared/tool/tool.query';
import { ToolService } from '../shared/tool/tool.service';

export const sessionProviders = [
  SessionStore,
  SessionQuery,
  SessionService
];

export const ga4ghFilesProviders = [
  GA4GHFilesStore,
  GA4GHFilesQuery,
  GA4GHFilesService
];

export const toolProviders = [
  ToolStore,
  ToolQuery,
  ToolService
];

@NgModule({
  providers: [sessionProviders, ga4ghFilesProviders, toolProviders]
})
export class CoreModule { }
