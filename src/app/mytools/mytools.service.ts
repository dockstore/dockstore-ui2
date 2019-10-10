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

import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { includesValidation } from 'app/shared/constants';
import { ContainerService } from 'app/shared/container.service';
import { EntryType } from 'app/shared/enum/entry-type';
import { MyEntriesStateService } from 'app/shared/state/my-entries.service';
import { ContainersService, DockstoreTool, UsersService, Workflow } from 'app/shared/swagger';
import { UrlResolverService } from 'app/shared/url-resolver.service';
import { finalize } from 'rxjs/operators';
import { MyEntriesService } from './../shared/myentries.service';
import { OrgToolObject } from './my-tool/my-tool.component';

@Injectable()
export class MytoolsService extends MyEntriesService<DockstoreTool, OrgToolObject> {
  constructor(
    private alertService: AlertService,
    private usersService: UsersService,
    private containerService: ContainerService,
    private myEntriesService: MyEntriesStateService,
    private location: Location,
    protected urlResolverService: UrlResolverService,
    private containersService: ContainersService
  ) {
    super(urlResolverService);
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
  selectEntry(tool: DockstoreTool | Workflow | null): void {
    if (tool !== null) {
      this.containersService.getContainer(tool.id, includesValidation).subscribe(result => {
        this.location.go('/my-tools/' + result.tool_path);
        this.containerService.setTool(result);
      });
    }
  }
  registerEntry(entryType: EntryType) {}

  convertToolsToOrgToolObject(tools: DockstoreTool[] | null, selectedTool: DockstoreTool): OrgToolObject[] {
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
          ...this.createOrgEntriesObject(tool)
        };
        orgToolObjects.push(newOrgToolObject);
      }
    });
    this.recursiveSortOrgToolObjects(orgToolObjects);
    this.setExpand(orgToolObjects, selectedTool);
    return orgToolObjects;
  }

  protected recursiveSortOrgToolObjects(orgToolObjects: OrgToolObject[]) {
    this.sortEntriesOfOrgEntryObjects(orgToolObjects);
    orgToolObjects.sort(this.sortOrgEntryObjects);
  }

  protected sortOrgEntryObjects(orgToolObjectA: OrgToolObject, orgToolObjectB: OrgToolObject): number {
    const keyA = [orgToolObjectA.registry, orgToolObjectA.namespace].join('/').toLowerCase();
    const keyB = [orgToolObjectB.registry, orgToolObjectB.namespace].join('/').toLowerCase();
    return keyA.localeCompare(keyB);
  }

  matchingOrgEntryObject(orgToolObjects: OrgToolObject[], selectedEntry: DockstoreTool): OrgToolObject {
    return orgToolObjects.find(orgToolObject => {
      return orgToolObject.namespace === selectedEntry.namespace && orgToolObject.registry === selectedEntry.registry_string;
    });
  }

  getPath(entry: DockstoreTool): string {
    return entry.tool_path;
  }

  sortEntry(entryA: DockstoreTool, entryB: DockstoreTool): number {
    const keyA = entryA.tool_path.toLowerCase();
    const keyB = entryB.tool_path.toLowerCase();
    return keyA.localeCompare(keyB);
  }
}
