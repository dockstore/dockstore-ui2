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
import { Base } from 'app/shared/base';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { SourceFile, ToolDescriptor } from '../../shared/openapi';
import { DockstoreTool } from '../../shared/openapi/model/dockstoreTool';
import { Workflow } from '../../shared/openapi/model/workflow';
import { ToolQuery } from '../../shared/tool/tool.query';
import { DescriptorLanguageService } from './../../shared/entry/descriptor-language.service';
import { Tag } from './../../shared/openapi/model/tag';
import { ToolLaunchService } from './tool-launch.service';
import { LaunchCheckerWorkflowComponent } from '../../shared/entry/launch-checker-workflow/launch-checker-workflow.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import DescriptorTypeEnum = Workflow.DescriptorTypeEnum;

@Component({
  selector: 'app-container-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.css'],
  standalone: true,
  imports: [
    NgIf,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    FlexModule,
    MatTooltipModule,
    LaunchCheckerWorkflowComponent,
    AsyncPipe,
  ],
})
export class LaunchComponent extends Base implements OnInit, OnChanges {
  @Input() basePath: string;
  @Input() path: string;
  @Input() toolname: string;
  @Input() mode: DockstoreTool.ModeEnum | Workflow.ModeEnum;
  @Input() versionsFileTypes: Array<SourceFile.TypeEnum>;

  _selectedVersion: Tag;
  @Input() selectedVersion: Tag;

  params: string;
  cli: string;
  cwl: string;
  dockstoreSupportedCwlLaunch: string;
  dockstoreSupportedCwlMakeTemplate: string;
  checkEntryCommand: string;
  consonance: string;
  descriptors: Array<Workflow.DescriptorTypeEnum>;
  filteredDescriptors: Array<string>;
  currentDescriptor: DescriptorTypeEnum;
  ToolDescriptor = ToolDescriptor;
  cwlrunnerDescription = this.launchService.cwlrunnerDescription;
  cwlrunnerTooltip = this.launchService.cwlrunnerTooltip;
  cwltoolTooltip = this.launchService.cwltoolTooltip;
  currentDescriptorType: ToolDescriptor.TypeEnum;
  protected published$: Observable<boolean>;
  selectedVersion$: BehaviorSubject<Tag> = new BehaviorSubject<Tag>(null);
  versionsFileTypes$: BehaviorSubject<Array<SourceFile.TypeEnum>> = new BehaviorSubject<Array<SourceFile.TypeEnum>>([]);
  path$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private launchService: ToolLaunchService,
    private toolQuery: ToolQuery,
    private descriptorLanguageService: DescriptorLanguageService
  ) {
    super();
  }

  ngOnInit(): void {
    this.published$ = this.toolQuery.toolIsPublished$;
    combineLatest([this.descriptorLanguageService.filteredDescriptorLanguages$, this.path$, this.selectedVersion$, this.versionsFileTypes$])
      .pipe(takeUntil(this.ngUnsubscribe), debounceTime(0))
      .subscribe(([filteredDescriptorLanguages, path, selectedVersion, versionsFileTypes]) => {
        this.filteredDescriptors = this.filterDescriptors(filteredDescriptorLanguages, selectedVersion, versionsFileTypes);
        this.changeDescriptor(path, selectedVersion, this.currentDescriptor);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._selectedVersion = this.selectedVersion;
    this.path$.next(this.path);
    this.selectedVersion$.next(this.selectedVersion);
    this.versionsFileTypes$.next(this.versionsFileTypes);
    this.reactToDescriptor();
  }

  // Returns an array of descriptors that are valid for the given tool version
  filterDescriptors(descriptors: Array<DescriptorTypeEnum>, version: Tag, versionsFileTypes: Array<SourceFile.TypeEnum>): Array<string> {
    const newDescriptors: Array<DescriptorTypeEnum> = [];

    // Return empty array if no descriptors present yet
    if (descriptors === undefined || version === undefined || versionsFileTypes === undefined) {
      return newDescriptors;
    }

    // Determine if the current version has CWL and/or WDL descriptors
    let hasCwl = false;
    let hasWdl = false;

    for (const fileType of versionsFileTypes) {
      if (fileType === SourceFile.TypeEnum.DOCKSTORECWL) {
        hasCwl = true;
      } else if (fileType === SourceFile.TypeEnum.DOCKSTOREWDL) {
        hasWdl = true;
      }
    }

    // Create a list of valid descriptors
    for (const descriptor of descriptors) {
      if ((descriptor === DescriptorTypeEnum.CWL && hasCwl) || (descriptor === DescriptorTypeEnum.WDL && hasWdl)) {
        newDescriptors.push(descriptor);
      }
    }

    // Preselect first descriptor in the list
    if (newDescriptors && newDescriptors.length > 0) {
      this.currentDescriptor = newDescriptors[0];
    }

    return newDescriptors;
  }

  reactToDescriptor(): void {
    const toolPath = this.path;
    const versionName = this._selectedVersion.name;
    this.cwl = this.launchService.getCwlString(toolPath, versionName, encodeURIComponent(this._selectedVersion.cwl_path));
    this.dockstoreSupportedCwlLaunch = this.launchService.getDockstoreSupportedCwlLaunchString(toolPath, versionName);
    this.dockstoreSupportedCwlMakeTemplate = this.launchService.getDockstoreSupportedCwlMakeTemplateString(toolPath, versionName);
    this.checkEntryCommand = this.launchService.getCheckToolString(toolPath, versionName);
    this.consonance = this.launchService.getConsonanceString(toolPath, versionName);
  }

  changeDescriptor(path: string, version: Tag, currentDescriptor: string) {
    const versionName = version.name;
    this.params = this.launchService.getParamsString(path, versionName, currentDescriptor);
    this.cli = this.launchService.getCliString(path, versionName, currentDescriptor);
  }
}
