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
import { transaction } from '@datorama/akita';

import { DateService } from '../date.service';
import { DockstoreService } from '../dockstore.service';
import { ImageProviderService } from '../image-provider.service';
import { ExtendedDockstoreTool } from '../models/ExtendedDockstoreTool';
import { ProviderService } from '../provider.service';
import { DockstoreTool } from '../openapi';
import { ExtendedDockstoreToolStore } from './extended-dockstoreTool.store';

@Injectable({
  providedIn: 'root',
})
export class ExtendedDockstoreToolService {
  constructor(
    private providerService: ProviderService,
    private imageProviderService: ImageProviderService,
    private dateService: DateService,
    private dockstoreService: DockstoreService,
    private extendedDockstoreToolStore: ExtendedDockstoreToolStore
  ) {}

  /**
   * Updates the extendedDockstoreTool by extended the current tool
   *
   * @param {DockstoreTool} tool
   * @memberof ExtendedDockstoreToolService
   */
  @transaction()
  update(tool: DockstoreTool) {
    if (tool) {
      this.extendedDockstoreToolStore.update(this.extendTool(tool));
    } else {
      this.remove();
    }
  }

  remove() {
    this.extendedDockstoreToolStore.update({});
  }

  extendTool(tool: DockstoreTool): ExtendedDockstoreTool {
    if (tool) {
      let extendedTool: ExtendedDockstoreTool = { ...tool };
      extendedTool = <ExtendedDockstoreTool>this.providerService.setUpProvider(extendedTool);
      extendedTool.buildModeTooltip = this.getBuildModeTooltip(extendedTool.mode);
      extendedTool = this.imageProviderService.setUpImageProvider(extendedTool);
      extendedTool.agoMessage = this.dateService.getAgoMessage(new Date(extendedTool.lastBuild).getTime());
      if (extendedTool.authors && extendedTool.authors.length) {
        extendedTool.email = this.dockstoreService.stripMailTo(extendedTool.authors[0].email);
      }
      extendedTool.lastBuildDate = this.dateService.getDateTimeMessage(new Date(extendedTool.lastBuild).getTime());
      extendedTool.lastUpdatedDate = this.dateService.getDateTimeMessage(new Date(extendedTool.lastUpdated).getTime());
      extendedTool.versionVerified = this.dockstoreService.getVersionVerified(extendedTool.workflowVersions);
      extendedTool.verifiedSources = this.dockstoreService.getVerifiedSources(extendedTool);
      return extendedTool;
    } else {
      return null;
    }
  }

  getBuildModeTooltip(mode: DockstoreTool.ModeEnum): string {
    switch (mode) {
      case DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS:
        return 'Fully automated: All versions are automated builds';
      case DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSWITHMIXED:
        return 'Partially automated: At least one version is an automated build';
      case DockstoreTool.ModeEnum.MANUALIMAGEPATH:
      case DockstoreTool.ModeEnum.HOSTED:
        return 'Manual: No versions are automated builds';
      default:
        return 'Unknown: Build information not known';
    }
  }
}
