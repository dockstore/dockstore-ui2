import { CheckerWorkflowService } from './../../shared/checker-workflow.service';
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

import { WorkflowDescriptorService } from './../descriptors/workflow-descriptor.service';
import { Component, Input } from '@angular/core';
import { WorkflowLaunchService } from '../launch/workflow-launch.service';
import { ContainerService } from '../../shared/container.service';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.css']
})
export class LaunchWorkflowComponent {
  @Input() path;
  @Input() currentDescriptor;

  _selectedVersion: WorkflowVersion;
  @Input() set selectedVersion(value: WorkflowVersion) {
    if (value != null) {
      this._selectedVersion = value;
      this.reactToDescriptor();
    }
  }

  params: string;
  cli: string;
  cwl: string;
  dockstoreSupportedCwlLaunch: string;
  dockstoreSupportedCwlMakeTemplate: string;
  consonance: string;
  descriptors: Array<any>;
  cwlrunnerDescription = this.launchService.cwlrunnerDescription;
  cwlrunnerTooltip = this.launchService.cwlrunnerTooltip;
  cwltoolTooltip = this.launchService.cwltoolTooltip;
  constructor(private launchService: WorkflowLaunchService, private workflowDescriptorService: WorkflowDescriptorService,
    private checkerWorkflowService: CheckerWorkflowService) {
  }
  getDescriptors(): any {
    return this.workflowDescriptorService.getDescriptors(this._selectedVersion);
  }
  reactToDescriptor(): void {
    this.changeMessages(this.path, this._selectedVersion.name);
  }
  private changeMessages(workflowPath: string, versionName: string) {
    this.params = this.launchService.getParamsString(workflowPath, versionName, this.currentDescriptor);
    this.cli = this.launchService.getCliString(workflowPath, versionName, this.currentDescriptor);
    this.cwl = this.launchService.getCwlString(workflowPath, versionName, encodeURIComponent(this._selectedVersion.workflow_path));
    this.dockstoreSupportedCwlLaunch = this.launchService.getDockstoreSupportedCwlLaunchString(workflowPath, versionName);
    this.dockstoreSupportedCwlMakeTemplate = this.launchService.getDockstoreSupportedCwlMakeTemplateString(workflowPath, versionName);
    this.consonance = this.launchService.getConsonanceString(workflowPath, versionName);
    this.checkerWorkflowService.checkerWorkflowVersionName$.next(versionName);
  }
}
