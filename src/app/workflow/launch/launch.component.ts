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
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ga4ghWorkflowIdPrefix } from '../../shared/constants';
import { EntryTab } from '../../shared/entry/entry-tab';
import { GA4GHFilesQuery } from '../../shared/ga4gh-files/ga4gh-files.query';
import { GA4GHFilesService } from '../../shared/ga4gh-files/ga4gh-files.service';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { ToolDescriptor, ToolFile } from '../../shared/openapi';
import { DockstoreTool } from '../../shared/openapi/model/dockstoreTool';
import { Dockstore } from '../../shared/dockstore.model';
import { Workflow } from '../../shared/openapi/model/workflow';
import { WorkflowVersion } from '../../shared/openapi/model/workflowVersion';
import { WorkflowLaunchService } from '../launch/workflow-launch.service';
import { EntryType } from '../../shared/enum/entry-type';
import { LaunchCheckerWorkflowComponent } from '../../shared/entry/launch-checker-workflow/launch-checker-workflow.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SnackbarDirective } from '../../shared/snackbar.directive';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.css'],
  standalone: true,
  imports: [
    NgIf,
    MatLegacyCardModule,
    MatIconModule,
    FlexModule,
    MatLegacyTooltipModule,
    MatLegacyButtonModule,
    SnackbarDirective,
    ClipboardModule,
    LaunchCheckerWorkflowComponent,
    AsyncPipe,
  ],
})
export class LaunchWorkflowComponent extends EntryTab implements OnInit, OnChanges {
  @Input() basePath;
  @Input() path;
  currentDescriptor: ToolDescriptor.TypeEnum;
  @Input() mode: DockstoreTool.ModeEnum | Workflow.ModeEnum;

  _selectedVersion: WorkflowVersion;
  @Input() selectedVersion: WorkflowVersion;
  @Input() entryType: EntryType;

  Dockstore = Dockstore;
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
  planemoSharedZipString: string;
  planemoLocalInitString: string;
  planemoLocalLaunchString: string;
  descriptors: Array<any>;
  cwlrunnerDescription = this.launchService.cwlrunnerDescription;
  cwlrunnerTooltip = this.launchService.cwlrunnerTooltip;
  cwltoolTooltip = this.launchService.cwltoolTooltip;
  primaryDescriptorPath: string;
  testParameterPath: string;
  descriptorType$: Observable<ToolDescriptor.TypeEnum>;
  isNFL$: Observable<boolean>;
  isGalaxy$: Observable<boolean>;
  ToolDescriptor = ToolDescriptor;
  EntryType = EntryType;
  protected published$: Observable<boolean>;
  protected ngUnsubscribe: Subject<{}> = new Subject();
  wesWrapperJson: string;
  wesLaunchCommand: string;
  wesTooltip = this.launchService.wesTooltip;

  constructor(
    private launchService: WorkflowLaunchService,
    private workflowQuery: WorkflowQuery,
    protected gA4GHFilesService: GA4GHFilesService,
    private gA4GHFilesQuery: GA4GHFilesQuery
  ) {
    super();
  }

  ngOnInit(): void {
    this.published$ = this.workflowQuery.workflowIsPublished$;
    this.descriptorType$ = this.workflowQuery.descriptorType$;
    this.descriptorType$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((descriptorType: ToolDescriptor.TypeEnum) => {
      this.currentDescriptor = descriptorType;
      this.reactToDescriptor();
    });
    this.isNFL$ = this.workflowQuery.isNFL$;
    this.isGalaxy$ = this.workflowQuery.isGalaxy$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._selectedVersion = this.selectedVersion;
    this.reactToDescriptor();
  }

  reactToDescriptor(): void {
    this.changeMessages(this.basePath, this.path, this._selectedVersion.name, this.currentDescriptor);
  }
  private changeMessages(basePath: string, workflowPath: string, versionName: string, descriptorType: ToolDescriptor.TypeEnum) {
    if (descriptorType === undefined) {
      return;
    }
    this.params = this.launchService.getParamsString(workflowPath, versionName, descriptorType);
    this.cli = this.launchService.getCliString(workflowPath, versionName, descriptorType);
    this.cwl = this.launchService.getCwlString(workflowPath, versionName, encodeURIComponent(this._selectedVersion.workflow_path));
    this.dockstoreSupportedCwlLaunch = this.launchService.getDockstoreSupportedCwlLaunchString(workflowPath, versionName, this.entryType);
    this.dockstoreSupportedCwlMakeTemplate = this.launchService.getDockstoreSupportedCwlMakeTemplateString(
      workflowPath,
      versionName,
      this.entryType
    );
    this.checkEntryCommand = this.launchService.getCheckWorkflowString(workflowPath, versionName);
    this.consonance = this.launchService.getConsonanceString(workflowPath, versionName);
    this.nextflowNativeLaunchDescription = this.launchService.getNextflowNativeLaunchString(basePath, versionName);
    this.nextflowLocalLaunchDescription = this.launchService.getNextflowLocalLaunchString();
    this.nextflowDownloadFileDescription = this.launchService.getNextflowDownload(basePath, versionName);
    this.updateWgetTestJsonString(workflowPath, versionName, descriptorType);
    this.wesLaunchCommand = this.launchService.getWesLaunch(workflowPath, versionName);
    this.wesWrapperJson = this.launchService.getAgcFileWrapper();
  }

  /**
   * Updates the wget test json string with the first available test parameter file
   * @param workflowPath
   * @param versionName
   */
  updateWgetTestJsonString(workflowPath: string, versionName: string, descriptorType: ToolDescriptor.TypeEnum): void {
    combineLatest([
      this.gA4GHFilesQuery.getToolFiles(descriptorType, [ToolFile.FileTypeEnum.TESTFILE]),
      this.gA4GHFilesQuery.getToolFiles(descriptorType, [ToolFile.FileTypeEnum.PRIMARYDESCRIPTOR]),
    ]).subscribe(
      ([toolFiles, descriptorFiles]) => {
        // test parameter file is optional ...
        if (toolFiles != undefined) {
          if (toolFiles.length > 0) {
            this.testParameterPath = toolFiles[0].path;
          } else {
            this.testParameterPath = undefined;
          }
          this.wgetTestJsonDescription = this.launchService.getTestJsonString(
            ga4ghWorkflowIdPrefix + workflowPath,
            versionName,
            descriptorType,
            this.testParameterPath
          );
        } else {
          this.testParameterPath = undefined;
        }
        if (descriptorFiles?.length > 0) {
          // ... but primary descriptor is mandatory
          this.primaryDescriptorPath = descriptorFiles[0].path;
          this.planemoSharedZipString = this.launchService.getSharedZipString(workflowPath, versionName);
          this.planemoLocalInitString = this.launchService.getPlanemoLocalInitString(workflowPath, versionName, this.primaryDescriptorPath);
          this.planemoLocalLaunchString = this.launchService.getPlanemoLocalLaunchString(
            workflowPath,
            versionName,
            this.primaryDescriptorPath
          );
        } else {
          this.primaryDescriptorPath = undefined;
          this.planemoLocalInitString = undefined;
          this.planemoLocalLaunchString = undefined;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
