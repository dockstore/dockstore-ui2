/*
 *    Copyright 2018 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContainerService } from './container.service';
import { DateService } from './date.service';
import { DockstoreService } from './dockstore.service';
import { ImageProviderService } from './image-provider.service';
import { ExtendedDockstoreTool } from './models/ExtendedDockstoreTool';
import { ProviderService } from './provider.service';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { ToolQuery } from './tool/tool.query';

/**
 * This service contains the ExtendedDockstoreTool observable.
 * All components that rely on the extended properties of the DockstoreTool should subscribe to the observable in this service.
 * @export
 * @class ExtendedToolService
 */
@Injectable()
export class ExtendedToolService {
  extendedDockstoreTool$: Observable<ExtendedDockstoreTool>;
  constructor(private containerService: ContainerService, private providerService: ProviderService,
    private imageProviderService: ImageProviderService, private dateService: DateService, private dockstoreService: DockstoreService,
    private toolQuery: ToolQuery) {
    this.extendedDockstoreTool$ = this.toolQuery.tool$.pipe(
      map((tool: DockstoreTool) => tool ? this.extendTool(tool) : null));
  }

  /**
   * Converts a DockstoreTool to an ExtendedDockstoreTool with more properties
   * UPDATE THIS WHEN NEW EXTENDED PROPERTIES ARE ADDED
   * @param {DockstoreTool} tool
   * @returns {ExtendedDockstoreTool}
   * @memberof ExtendedToolService
   */
  extendTool(tool: DockstoreTool): ExtendedDockstoreTool {
    if (tool) {
      let extendedTool: ExtendedDockstoreTool = { ...tool };
      extendedTool = <ExtendedDockstoreTool>this.providerService.setUpProvider(extendedTool);
      extendedTool.buildMode = this.containerService.getBuildMode(extendedTool.mode);
      extendedTool.buildModeTooltip = this.containerService.getBuildModeTooltip(extendedTool.mode);
      extendedTool = this.imageProviderService.setUpImageProvider(extendedTool);
      extendedTool.agoMessage = this.dateService.getAgoMessage(new Date(extendedTool.lastBuild).getTime());
      extendedTool.email = this.dockstoreService.stripMailTo(extendedTool.email);
      extendedTool.lastBuildDate = this.dateService.getDateTimeMessage(new Date(extendedTool.lastBuild).getTime());
      extendedTool.lastUpdatedDate = this.dateService.getDateTimeMessage(new Date(extendedTool.lastUpdated).getTime());
      extendedTool.versionVerified = this.dockstoreService.getVersionVerified(extendedTool.tags);
      extendedTool.verifiedSources = this.dockstoreService.getVerifiedSources(extendedTool);
      return extendedTool;
    } else {
      return null;
    }
  }
}
