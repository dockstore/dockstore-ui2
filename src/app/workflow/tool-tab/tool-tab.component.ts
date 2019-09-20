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
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { EntryTab } from '../../shared/entry/entry-tab';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { ToolDescriptor, WorkflowVersion } from '../../shared/swagger';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { Workflow } from './../../shared/swagger/model/workflow';
import { ToolTabService } from './tool-tab.service';
import { BioWorkflow } from 'app/shared/swagger/model/bioWorkflow';
import { Service } from 'app/shared/swagger/model/service';

@Component({
  selector: 'app-tool-tab',
  templateUrl: './tool-tab.component.html',
  styleUrls: ['./tool-tab.component.scss']
})
export class ToolTabComponent extends EntryTab {
  workflow: BioWorkflow | Service;
  toolContent: string = null;
  _selectedVersion: WorkflowVersion;
  descriptorType$: Observable<ToolDescriptor.TypeEnum>;
  ToolDescriptor = ToolDescriptor;
  toolExcerptHeaderName$: Observable<string>;
  workflowExcerptRowHeading$: Observable<string>;
  displayedColumns: string[] = ['workflowExcerpt', 'toolExcerpt'];
  // TODO: Put most of this stuff in Akita state
  hasContent = false;
  nullContent = false;
  noContent = false;
  loading = true;
  @Input() set selectedVersion(value: WorkflowVersion) {
    if (value != null) {
      this.workflow = this.workflowQuery.getActive();
      // Also check that the workflow version belongs to the workflow
      if (this.workflow && this.workflow.workflowVersions && this.workflow.workflowVersions.some(version => version.id === value.id)) {
        this.getTableToolContent(this.workflow.id, value.id);
      } else {
        this.handleNullToolContent();
        console.error('Should not be able to select version without a workflow');
      }
    } else {
      this.handleNullToolContent();
    }
  }

  constructor(private workflowQuery: WorkflowQuery, private workflowsService: WorkflowsService, private toolTabService: ToolTabService) {
    super();
    this.descriptorType$ = this.workflowQuery.descriptorType$;
    this.toolExcerptHeaderName$ = this.descriptorType$.pipe(
      map(descriptorType => this.toolTabService.descriptorTypeToHeaderName(descriptorType))
    );
    this.workflowExcerptRowHeading$ = this.descriptorType$.pipe(
      map(descriptorType => this.toolTabService.descriptorTypeToWorkflowExcerptRowHeading(descriptorType))
    );
  }

  /**
   * Update the table tool contents for the current workflow and workflow version
   *
   * @param {number} workflowId  The workflow Id
   * @param {number} versionId   The workflowVersion Id
   * @memberof ToolTabComponent
   */
  getTableToolContent(workflowId: number, versionId: number): void {
    if (workflowId && versionId) {
      this.loading = true;
      this.workflowsService
        .getTableToolContent(workflowId, versionId)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(
          toolContent => {
            this.handleToolContent(toolContent);
          },
          error => {
            console.log('Could not retrieve table tool content');
            this.handleToolContent(null);
          }
        );
    } else {
      this.handleNullToolContent();
    }
  }

  /**
   * Updates the 3 boolean variables that determines what to show (one of the 2 warnings or the table)
   *
   * @private
   * @param {string} toolContent  The current workflow version's toolContent
   * @memberof ToolTabComponent
   */
  private handleToolContent(toolContent: string): void {
    this.hasContent = false;
    this.noContent = false;
    this.nullContent = false;
    this.toolContent = toolContent;
    if (!toolContent) {
      this.hasContent = false;
      this.noContent = false;
      this.nullContent = true;
    } else {
      if (toolContent.length === 0) {
        this.hasContent = false;
        this.noContent = true;
        this.nullContent = false;
      } else {
        this.hasContent = true;
        this.noContent = false;
        this.nullContent = false;
      }
    }
  }

  /**
   * Handle when no tool content was able to be retrieved
   *
   * @private
   * @memberof ToolTabComponent
   */
  private handleNullToolContent(): void {
    this.handleToolContent(null);
    this.loading = false;
  }
}
