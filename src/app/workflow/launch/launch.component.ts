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
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { EntryTab } from '../../shared/entry/entry-tab';
import { GA4GHFilesStateService } from '../../shared/entry/GA4GHFiles.state.service';
import { ToolFile } from '../../shared/swagger';
import { WorkflowVersion } from '../../shared/swagger/model/workflowVersion';
import { WorkflowService } from '../../shared/workflow.service';
import { WorkflowLaunchService } from '../launch/workflow-launch.service';
import { ga4ghWorkflowIdPrefix } from '../../shared/constants';
import { Workflow } from '../../shared/swagger/model/workflow';
import { DockstoreTool } from '../../shared/swagger/model/dockstoreTool';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.css']
})
export class LaunchWorkflowComponent extends EntryTab {
  @Input() basePath: string;
  @Input() path: string;
  @Input() currentDescriptor: string;
  @Input() mode: (DockstoreTool.ModeEnum | Workflow.ModeEnum);

  _selectedVersion: WorkflowVersion;
  @Input() set selectedVersion(value: WorkflowVersion) {
    if (value != null) {
      this._selectedVersion = value;
      this.reactToDescriptor();
    }
  }

  DockstoreToolType = DockstoreTool;
  WorkflowType = Workflow;
  params: string;
  cli: string;
  cwl: string;
  dockstoreSupportedCwlLaunch: string;
  dockstoreSupportedCwlMakeTemplate: string;
  checkEntryCommand: string;
  consonance: string;
  wgetTestJsonDescription: string;
  nextflowNativeLaunchDescription: string;
  nextflowLocalLaunchDescription: string;
  nextflowDownloadFileDescription: string;
  descriptors: Array<any>;
  cwlrunnerDescription = this.launchService.cwlrunnerDescription;
  cwlrunnerTooltip = this.launchService.cwlrunnerTooltip;
  cwltoolTooltip = this.launchService.cwltoolTooltip;
  testParameterPath: string;
  protected published$: Observable<boolean>;
  protected ngUnsubscribe: Subject<{}> = new Subject();

  constructor(private launchService: WorkflowLaunchService, private workflowService: WorkflowService,
    protected gA4GHFilesStateService: GA4GHFilesStateService) {
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
    this.nextflowLocalLaunchDescription = this.launchService.getNextflowLocalLaunchString();
    this.nextflowDownloadFileDescription = this.launchService.getNextflowDownload(basePath, versionName);
    this.updateWgetTestJsonString(workflowPath, versionName);
  }

  /**
   * Updates the wget test json string with the first available test parameter file
   * @param workflowPath
   * @param versionName
   */
  updateWgetTestJsonString(workflowPath: string, versionName: string): void {
    let descriptorToolFiles$: BehaviorSubject<Array<ToolFile>>;
    switch (this.currentDescriptor) {
      case 'wdl': {
        descriptorToolFiles$ = this.gA4GHFilesStateService.wdlToolFiles$;
        break;
      }
      case 'cwl': {
        descriptorToolFiles$ = this.gA4GHFilesStateService.cwlToolFiles$;
        break;
      }
      case 'nfl': {
        descriptorToolFiles$ = this.gA4GHFilesStateService.nflToolFiles$;
        break;
      }
      default: {
        console.error('Unknown descriptor type: ' + this.currentDescriptor);
      }
    }

    descriptorToolFiles$.pipe(map((toolFiles: Array<ToolFile>) => {
      if (toolFiles) {
        return toolFiles.filter(toolFile => toolFile.file_type === ToolFile.FileTypeEnum.TESTFILE);
      } else {
        return [];
      }
    })).pipe(takeUntil(this.ngUnsubscribe)).subscribe((toolFiles: Array<ToolFile>) => {
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
