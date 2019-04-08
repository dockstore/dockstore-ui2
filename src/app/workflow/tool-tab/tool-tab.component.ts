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

@Component({
  selector: 'app-tool-tab',
  templateUrl: './tool-tab.component.html',
  styleUrls: ['./tool-tab.component.scss']
})
export class ToolTabComponent extends EntryTab {
  workflow: Workflow;
  toolsContent: string = null;
  _selectedVersion: WorkflowVersion;
  descriptorType$: Observable<ToolDescriptor.TypeEnum>;
  ToolDescriptor = ToolDescriptor;
  toolExcerptHeaderName$: Observable<string>;
  workflowExcerptRowHeading$: Observable<string>;
  displayedColumns: string[] = ['workflowExcerpt', 'toolExcerpt'];
  loading = true;
  @Input() set selectedVersion(value: WorkflowVersion) {
    if (value != null) {
      this.workflow = this.workflowQuery.getActive();
      // Also check that the workflow version belongs to the workflow
      if (this.workflow && this.workflow.workflowVersions && this.workflow.workflowVersions.some(version => version.id === value.id)) {
        this.updateTableToolContent(this.workflow.id, value.id);
      } else {
        this.loading = false;
        console.error('Should not be able to select version without a workflow');
      }
    } else {
      this.loading = false;
      this.toolsContent = null;
    }
  }
  constructor(private workflowQuery: WorkflowQuery, private workflowsService: WorkflowsService) {
    super();
    this.descriptorType$ = this.workflowQuery.descriptorType$;
    this.toolExcerptHeaderName$ = this.descriptorType$.pipe(map(descriptorType => this.descriptorTypeToHeaderName(descriptorType)));
    this.workflowExcerptRowHeading$ = this.descriptorType$.pipe(
      map(descriptorType => this.descriptorTypeToWorkflowExcerptRowHeading(descriptorType)));
  }

  /**
   * Update the table tool contents for the current workflow and workflow version
   *
   * @param {number} workflowId  The workflow Id
   * @param {number} versionId   The workflowVersion Id
   * @memberof ToolTabComponent
   */
  updateTableToolContent(workflowId: number, versionId: number): void {
    if (workflowId && versionId) {
      this.loading = true;
      this.workflowsService.getTableToolContent(workflowId, versionId).pipe(finalize(() => this.loading = false)).subscribe(
        (toolContent) => {
          this.toolsContent = toolContent;
        }, error => {
          console.log('Could not retrieve table tool content');
          this.toolsContent = null;
        });
    } else {
      this.loading = false;
      this.toolsContent = null;
    }
  }

  /**
   * Determines the second column's header name. No break needed because headings are always short.
   *
   * @param {ToolDescriptor.TypeEnum} descriptorType
   * @returns
   * @memberof ToolTabComponent
   */
  descriptorTypeToHeaderName(descriptorType: ToolDescriptor.TypeEnum) {
    switch (descriptorType) {
      case ToolDescriptor.TypeEnum.CWL:
        return 'Tool Excerpt';
      case ToolDescriptor.TypeEnum.WDL:
        return 'Task Excerpt';
      case ToolDescriptor.TypeEnum.NFL:
        return 'Process Excerpt';
      default:
        console.error('Unknown descriptor type found: ' + descriptorType);
        return 'Tool Excerpt';
    }
  }

  /**
   * In the Workflow Excerpt column, each row will have a heading before the tool.id.
   * This determines that heading.
   *
   * @param {ToolDescriptor.TypeEnum} descriptorType
   * @returns {string}
   * @memberof ToolTabComponent
   */
  descriptorTypeToWorkflowExcerptRowHeading(descriptorType: ToolDescriptor.TypeEnum): string {
    switch (descriptorType) {
      case ToolDescriptor.TypeEnum.CWL:
        return 'tool\xa0ID';
      case ToolDescriptor.TypeEnum.WDL:
        return 'task\xa0ID';
      case ToolDescriptor.TypeEnum.NFL:
        return 'process\xa0name';
      default:
        console.error('Unknown descriptor type found: ' + descriptorType);
        return 'tool\xa0ID';
    }
  }
}
