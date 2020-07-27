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
import { Base } from 'app/shared/base';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SourceFile, ToolDescriptor } from '../../shared/swagger';
import { DockstoreTool } from '../../shared/swagger/model/dockstoreTool';
import { Workflow } from '../../shared/swagger/model/workflow';
import { ToolQuery } from '../../shared/tool/tool.query';
import { DescriptorLanguageService } from './../../shared/entry/descriptor-language.service';
import { Tag } from './../../shared/swagger/model/tag';
import { ToolLaunchService } from './tool-launch.service';
import DescriptorTypeEnum = Workflow.DescriptorTypeEnum;

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.css']
})
export class LaunchComponent extends Base {
  @Input() basePath: string;
  @Input() path: string;
  @Input() toolname: string;
  @Input() mode: DockstoreTool.ModeEnum | Workflow.ModeEnum;
  @Input() versionsFileTypes: Array<SourceFile.TypeEnum>;

  _selectedVersion: Tag;
  @Input() set selectedVersion(value: Tag) {
    if (value != null) {
      this._selectedVersion = value;
      this.reactToDescriptor();
      this.filteredDescriptors = this.filterDescriptors(this.descriptors, this._selectedVersion, this.versionsFileTypes);
    }
  }

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

  constructor(
    private launchService: ToolLaunchService,
    private toolQuery: ToolQuery,
    private descriptorLanguageService: DescriptorLanguageService
  ) {
    super();
    this.descriptorLanguageService.filteredDescriptorLanguages$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((descriptors: Array<Workflow.DescriptorTypeEnum>) => {
        this.descriptors = descriptors;
        this.filteredDescriptors = this.filterDescriptors(this.descriptors, this._selectedVersion, this.versionsFileTypes);
      });
    this.published$ = this.toolQuery.toolIsPublished$;
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
    this.params = this.launchService.getParamsString(toolPath, versionName, this.currentDescriptor);
    this.cli = this.launchService.getCliString(toolPath, versionName, this.currentDescriptor);
    this.cwl = this.launchService.getCwlString(toolPath, versionName, encodeURIComponent(this._selectedVersion.cwl_path));
    this.dockstoreSupportedCwlLaunch = this.launchService.getDockstoreSupportedCwlLaunchString(toolPath, versionName);
    this.dockstoreSupportedCwlMakeTemplate = this.launchService.getDockstoreSupportedCwlMakeTemplateString(toolPath, versionName);
    this.checkEntryCommand = this.launchService.getCheckToolString(toolPath, versionName);
    this.consonance = this.launchService.getConsonanceString(toolPath, versionName);
  }
}
