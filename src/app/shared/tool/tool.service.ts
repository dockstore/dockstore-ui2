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
import { ExtendedDockstoreToolService } from '../extended-dockstoreTool/extended-dockstoreTool.service';
import { DockstoreTool, Tag } from '../swagger';
import { ToolQuery } from './tool.query';
import { ToolStore } from './tool.store';

@Injectable({
  providedIn: 'root'
})
export class ToolService {
  constructor(
    private toolStore: ToolStore,
    private extendedDockstoreToolService: ExtendedDockstoreToolService,
    private toolQuery: ToolQuery
  ) {}

  @transaction()
  setTool(tool: DockstoreTool | null) {
    if (tool) {
      this.toolStore.createOrReplace(tool.id, tool);
      this.extendedDockstoreToolService.update(tool);
      this.toolStore.setActive(tool.id);
    } else {
      this.toolStore.remove();
      this.extendedDockstoreToolService.remove();
    }
  }

  clearActive() {
    this.toolStore.setActive(null);
  }

  @transaction()
  setTags(workflowVersions: Array<Tag> | null) {
    this.toolStore.updateActive(active => {
      return {
        ...active.workflowVersions,
        workflowVersions
      };
    });
    this.extendedDockstoreToolService.update(this.toolQuery.getActive());
  }
}
