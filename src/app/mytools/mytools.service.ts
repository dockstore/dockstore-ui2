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
import { includesAuthors, includesValidation } from 'app/shared/constants';
import { ContainerService } from 'app/shared/container.service';
import { EntryType } from 'app/shared/enum/entry-type';
import { MyEntriesStateService } from 'app/shared/state/my-entries.service';
import { AppTool, ContainersService, DockstoreTool, UsersService, Workflow, WorkflowsService } from 'app/shared/swagger';
import { UrlResolverService } from 'app/shared/url-resolver.service';
import { finalize } from 'rxjs/operators';
import { MyEntriesService } from './../shared/myentries.service';
import { OrgToolObject } from './my-tool/my-tool.component';
import { WorkflowService } from '../shared/state/workflow.service';
import { OrgWorkflowObject } from '../myworkflows/my-workflow/my-workflow.component';

@Injectable()
export class MytoolsService extends MyEntriesService<DockstoreTool, OrgToolObject<DockstoreTool>> {
  constructor(
    private alertService: AlertService,
    private usersService: UsersService,
    private containerService: ContainerService,
    private workflowService: WorkflowService,
    private workflowsService: WorkflowsService,
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
        (tools) => {
          this.containerService.setTools(tools);
          this.alertService.simpleSuccess();
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );

    this.usersService
      .userAppTools(userId)
      .pipe(finalize(() => this.myEntriesService.setRefreshingMyEntries(false)))
      .subscribe((appTools: Array<Workflow>) => {
        this.workflowService.setWorkflows(appTools);
      });
  }

  selectEntry(tool: DockstoreTool | Workflow | null): void {
    if (tool && tool.id) {
      if (MytoolsService.isWorkflowBasedObject(tool)) {
        this.workflowsService.getWorkflow(tool.id, includesValidation + ',' + includesAuthors).subscribe((result) => {
          this.location.go('/my-tools/' + result.full_workflow_path);
          this.workflowService.setWorkflow(<AppTool>result);
          // We check that the shared workflows are not null in upsertWorkflowToWorkflow
          this.workflowService.setSharedWorkflows([]);
          this.containerService.setTool(null);
        });
      } else {
        this.containersService.getContainer(tool.id, includesValidation).subscribe((result) => {
          this.location.go('/my-tools/' + result.tool_path);
          this.containerService.setTool(result);
          this.workflowService.setWorkflow(null);
        });
      }
    }
  }

  // GitHub App Tools are Workflows in the backend, but are displayed as tools to users
  static isWorkflowBasedObject(
    tool: DockstoreTool | AppTool | OrgToolObject<DockstoreTool> | OrgWorkflowObject<Workflow>
  ): tool is Workflow {
    if (tool !== null) {
      return (tool as AppTool).organization !== undefined;
    }
  }

  static isDockstoreTool(tool: DockstoreTool | AppTool): tool is DockstoreTool {
    if (tool !== null) {
      return (tool as DockstoreTool).registry !== undefined;
    }
  }

  registerEntry(entryType: EntryType) {}

  protected sortOrgEntryObjects(orgToolObjectA: OrgToolObject<DockstoreTool>, orgToolObjectB: OrgToolObject<DockstoreTool>): number {
    const keyA = [orgToolObjectA.registry, orgToolObjectA.namespace].join('/').toLowerCase();
    const keyB = [orgToolObjectB.registry, orgToolObjectB.namespace].join('/').toLowerCase();
    return keyA.localeCompare(keyB);
  }

  createNewOrgEntryObject(tool: DockstoreTool): OrgToolObject<DockstoreTool> {
    return {
      registry: tool.registry_string,
      namespace: tool.namespace,
      ...this.createPartial(tool),
    };
  }

  matchingOrgEntryObject(
    orgToolObjects: OrgToolObject<DockstoreTool>[],
    selectedEntry: DockstoreTool
  ): OrgToolObject<DockstoreTool> | undefined {
    return orgToolObjects.find((orgToolObject) => {
      return orgToolObject.namespace === selectedEntry.namespace && orgToolObject.registry === selectedEntry.registry_string;
    });
  }

  getPath(entry: DockstoreTool | Workflow): string {
    if (MytoolsService.isWorkflowBasedObject(entry)) {
      return entry.full_workflow_path || '';
    } else {
      return entry.tool_path || '';
    }
  }

  sortEntry(entryA: DockstoreTool | Workflow, entryB: DockstoreTool | Workflow): number {
    let topLevelA: string;
    let topLevelB: string;
    let midLevelA: string;
    let midLevelB: string;
    let lowerLevelA: string;
    let lowerLevelB: string;
    if (MytoolsService.isWorkflowBasedObject(entryA)) {
      topLevelA = entryA.sourceControl;
      midLevelA = entryA.organization;
      lowerLevelA = entryA.full_workflow_path || '';
    } else if (MytoolsService.isDockstoreTool(entryA)) {
      topLevelA = entryA.registry_string;
      midLevelA = entryA.namespace;
      lowerLevelA = entryA.tool_path || '';
    }

    if (MytoolsService.isWorkflowBasedObject(entryB)) {
      topLevelB = entryB.sourceControl;
      midLevelB = entryB.organization;
      lowerLevelB = entryB.full_workflow_path || '';
    } else if (MytoolsService.isDockstoreTool(entryB)) {
      topLevelB = entryB.registry_string;
      midLevelB = entryB.namespace;
      lowerLevelB = entryB.tool_path || '';
    }

    topLevelA = topLevelA.toLowerCase();
    topLevelB = topLevelB.toLowerCase();
    const compareRegistry = topLevelA.localeCompare(topLevelB);
    if (compareRegistry) {
      return compareRegistry;
    }

    midLevelA = midLevelA.toLowerCase();
    midLevelB = midLevelB.toLowerCase();
    const compareMidLevel = midLevelA.localeCompare(midLevelB);
    if (compareMidLevel) {
      return compareMidLevel;
    }

    lowerLevelA = lowerLevelA.toLowerCase();
    lowerLevelB = lowerLevelB.toLowerCase();
    return lowerLevelA.localeCompare(lowerLevelB);
  }
}
