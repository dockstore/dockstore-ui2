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

import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';
import { Workflow } from './../../shared/swagger/model/workflow';
import { WorkflowService } from './../../shared/workflow.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tool-tab',
  templateUrl: './tool-tab.component.html',
  styleUrls: ['./tool-tab.component.css']
})
export class ToolTabComponent implements OnInit {
  workflow: Workflow;
  toolsContent: any;
  _selectedVersion: any;
  @Input() set selectedVersion(value: any) {
    if (value != null) {
      this._selectedVersion = value;
      this.onChange();
    }
  }
  constructor(private workflowService: WorkflowService, private workflowsService: WorkflowsService) { }

  ngOnInit() {
    this.workflowService.workflow$.subscribe(workflow => {
      if (workflow) {
        this.workflow = workflow;
        if (workflow.workflowVersions) {
          this.onChange();
        }
      }
    });
  }

  onChange() {
    if (this._selectedVersion && this.workflow) {
      this.workflowsService.getTableToolContent(this.workflow.id, this._selectedVersion.id).subscribe(
        (toolContent) => {
          this.toolsContent = toolContent;
        }, error => this.toolsContent = null);
    } else {
      this.toolsContent = null;
    }
  }
}
