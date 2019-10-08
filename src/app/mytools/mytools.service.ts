/*
 *    Copyright 2017 OICR
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

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { ContainerService } from 'app/shared/container.service';
import { EntryType } from 'app/shared/enum/entry-type';
import { MyEntriesStateService } from 'app/shared/state/my-entries.service';
import { DockstoreTool, UsersService } from 'app/shared/swagger';
import { finalize } from 'rxjs/operators';
import { MyEntriesService } from './../shared/myentries.service';
import { OrgToolObject } from './my-tool/my-tool.component';

@Injectable()
export class MytoolsService extends MyEntriesService {
  constructor(
    private alertService: AlertService,
    private usersService: UsersService,
    private containerService: ContainerService,
    private myEntriesService: MyEntriesStateService
  ) {
    super();
  }
  getGroupIndex(groupEntries: any[], group: string): number {
    return groupEntries.findIndex(nsContainer => nsContainer.namespace === group);
  }

  getMyEntries(userId: number, entryType: EntryType) {
    this.alertService.start('Fetching tools');
    this.myEntriesService.setRefreshingMyEntries(true);
    this.usersService
      .userContainers(userId)
      .pipe(finalize(() => this.myEntriesService.setRefreshingMyEntries(false)))
      .subscribe(
        tools => {
          this.containerService.setTools(tools);
          this.alertService.simpleSuccess();
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
  }

  registerEntry(entryType: EntryType) {}

  convertToolsToOrgToolObject(tools: DockstoreTool[]): OrgToolObject[] {
    if (!tools) {
      return [];
    }
    const orgToolObjects: OrgToolObject[] = [];
    tools.forEach(tool => {
      const existingOrgToolObject = orgToolObjects.find(
        orgToolObject => orgToolObject.registry === tool.registry_string && orgToolObject.namespace === tool.namespace
      );
      if (existingOrgToolObject) {
        if (tool.is_published) {
          existingOrgToolObject.published.push(tool);
        } else {
          existingOrgToolObject.unpublished.push(tool);
        }
      } else {
        const newOrgToolObject: OrgToolObject = {
          registry: tool.registry_string,
          namespace: tool.namespace,
          published: tool.is_published ? [tool] : [],
          unpublished: tool.is_published ? [] : [tool],
          expanded: false
        };
        orgToolObjects.push(newOrgToolObject);
      }
    });
    return orgToolObjects;
  }

  recursiveSortOrgToolObjects(orgToolObjects: OrgToolObject[]) {
    orgToolObjects.forEach(orgToolObject => {
      orgToolObject.published.sort(this.sortTools);
    });
    orgToolObjects.sort(this.sortOrgToolObjects);
  }

  sortTools(toolA: DockstoreTool, toolB: DockstoreTool): number {
    const keyA = toolA.tool_path.toLowerCase();
    const keyB = toolB.tool_path.toLowerCase();
    if (keyA < keyB) {
      return -1;
    }
    if (keyA > keyB) {
      return 1;
    }
    return 0;
  }

  sortOrgToolObjects(orgToolObjectA: OrgToolObject, orgToolObjectB: OrgToolObject): number {
    const keyA = [orgToolObjectA.registry, orgToolObjectA.namespace].join('/').toLowerCase();
    const keyB = [orgToolObjectB.registry, orgToolObjectB.namespace].join('/').toLowerCase();
    if (keyA < keyB) {
      return -1;
    }
    if (keyA > keyB) {
      return 1;
    }
    return 0;
  }

  setExpand(orgToolObjects: OrgToolObject[], selectedTool: DockstoreTool) {
    if (!selectedTool) {
      return;
    }
    const foundOrgToolObject = orgToolObjects.find(orgToolObject => {
      return orgToolObject.namespace === selectedTool.namespace && orgToolObject.registry === selectedTool.registry_string;
    });
    if (foundOrgToolObject) {
      foundOrgToolObject.expanded = true;
    }
  }
}
