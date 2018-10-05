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
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { EntryTab } from '../../shared/entry/entry-tab';
import { GA4GHFilesQuery } from '../../shared/ga4gh-files/ga4gh-files.query';
import { GA4GHFilesService } from '../../shared/ga4gh-files/ga4gh-files.service';
import { WebserviceDescriptorType } from '../../shared/models/DescriptorType';
import { ToolFile } from '../../shared/swagger';
import { WorkflowVersion } from '../../shared/swagger/model/workflowVersion';
import { WorkflowService } from '../../shared/workflow.service';
import { WorkflowLaunchService } from '../launch/workflow-launch.service';
import { ga4ghWorkflowIdPrefix } from '../../shared/constants';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.css']
})
export class LaunchWorkflowComponent extends EntryTab {
  @Input() basePath;
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
  checkEntryCommand: string;
  consonance: string;
  wgetTestJsonDescription: string;
  nextflowNativeLaunchDescription: string;
  descriptors: Array<any>;
  cwlrunnerDescription = this.launchService.cwlrunnerDescription;
  cwlrunnerTooltip = this.launchService.cwlrunnerTooltip;
  cwltoolTooltip = this.launchService.cwltoolTooltip;
  testParameterPath: string;
  protected published$: Observable<boolean>;
  protected ngUnsubscribe: Subject<{}> = new Subject();

  constructor(private launchService: WorkflowLaunchService, private workflowService: WorkflowService,
    protected gA4GHFilesService: GA4GHFilesService, private gA4GHFilesQuery: GA4GHFilesQuery) {
    super();
    this.published$ = this.workflowService.workflowIsPublished$;
  }
  reactToDescriptor(): void {
    this.changeMessages(this.basePath, this.path, this._selectedVersion.name);
  }
  private changeMessages(basePath: string, workflowPath: string, versionName: string) {
    this.params = this.launchService.getParamsString(workflowPath, versionName, this.currentDescriptor);
    this.cli = this.launchService.getCliString(workflowPath, versionName, this.currentDescriptor);
    this.cwl = this.launchService.getCwlString(workflowPath, versionName, encodeURIComponent(this._selectedVersion.workflow_path));
    this.dockstoreSupportedCwlLaunch = this.launchService.getDockstoreSupportedCwlLaunchString(workflowPath, versionName);
    this.dockstoreSupportedCwlMakeTemplate = this.launchService.getDockstoreSupportedCwlMakeTemplateString(workflowPath, versionName);
    this.checkEntryCommand = this.launchService.getCheckWorkflowString(workflowPath, versionName);
    this.consonance = this.launchService.getConsonanceString(workflowPath, versionName);
    this.nextflowNativeLaunchDescription = this.launchService.getNextflowNativeLaunchString(basePath, versionName);
    this.updateWgetTestJsonString(workflowPath, versionName, this.currentDescriptor);
  }

  /**
   * Updates the wget test json string with the first available test parameter file
   * @param workflowPath
   * @param versionName
   */
  updateWgetTestJsonString(workflowPath: string, versionName: string, descriptorType: WebserviceDescriptorType): void {
      let toolFiles$: Observable<Array<ToolFile>>;
      toolFiles$ = this.gA4GHFilesQuery.getToolFiles(descriptorType, [ToolFile.FileTypeEnum.TESTFILE]);
      toolFiles$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((toolFiles: Array<ToolFile>) => {
        if (toolFiles.length > 0) {
          this.testParameterPath = toolFiles[0].path;
        } else {
          this.testParameterPath = null;
        }
        this.wgetTestJsonDescription = this.launchService.getTestJsonString(ga4ghWorkflowIdPrefix + workflowPath, versionName,
          this.currentDescriptor, this.testParameterPath);
      });
    }
}
