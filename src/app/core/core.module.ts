import { NgModule } from '@angular/core';

import { ExtendedDockstoreToolQuery } from '../shared/extended-dockstoreTool/extended-dockstoreTool.query';
import { ExtendedDockstoreToolService } from '../shared/extended-dockstoreTool/extended-dockstoreTool.service';
import { ExtendedDockstoreToolStore } from '../shared/extended-dockstoreTool/extended-dockstoreTool.store';
import { GA4GHFilesQuery } from '../shared/ga4gh-files/ga4gh-files.query';
import { GA4GHFilesService } from '../shared/ga4gh-files/ga4gh-files.service';
import { GA4GHFilesStore } from '../shared/ga4gh-files/ga4gh-files.store';
import { SessionQuery } from '../shared/session/session.query';
import { SessionService } from '../shared/session/session.service';
import { SessionStore } from '../shared/session/session.store';
import { ToolQuery } from '../shared/tool/tool.query';
import { ToolService } from '../shared/tool/tool.service';
import { ToolStore } from '../shared/tool/tool.store';
import { UserQuery } from '../shared/user/user.query';
import { UserService } from '../shared/user/user.service';
import { UserStore } from '../shared/user/user.store';

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

export const extendedDockstoreToolProviders = [
  ExtendedDockstoreToolStore,
  ExtendedDockstoreToolQuery,
  ExtendedDockstoreToolService
];

export const userProviders = [
  UserStore,
  UserQuery,
  UserService
];

@NgModule({
  providers: [sessionProviders, ga4ghFilesProviders, toolProviders, userProviders]
})
export class CoreModule { }
