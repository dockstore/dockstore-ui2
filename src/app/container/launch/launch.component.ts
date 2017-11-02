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

import { ToolDescriptorService } from '../descriptors/tool-descriptor.service';
import { Component, Input } from '@angular/core';

import { DescriptorSelector } from '../../shared/selectors/descriptor-selector';

import { ToolLaunchService } from './tool-launch.service';
import { ContainerService } from '../../shared/container.service';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.css']
})
export class LaunchComponent extends DescriptorSelector {

  @Input() path;
  @Input() toolname;

  params: string;
  cli: string;
  cwl: string;
  consonance: string;
  descriptors: Array<any>;

  constructor(private launchService: ToolLaunchService,
              private toolDescriptorService: ToolDescriptorService) {
    super();
  }
  getDescriptors(currentVersion): any {
    return this.toolDescriptorService.getDescriptors(this.versions, this.default);
  }

  reactToDescriptor(): void {
    let fullToolPath = this.path;
    if (this.toolname) {
      fullToolPath += '/' + this.toolname;
    }
    this.changeMessages(fullToolPath, this.currentVersion.name);
  }

  private changeMessages(toolPath: string, versionName: string) {
    this.params = this.launchService.getParamsString(toolPath, versionName, this.currentDescriptor);
    this.cli = this.launchService.getCliString(toolPath, versionName, this.currentDescriptor);
    this.cwl = this.launchService.getCwlString(toolPath, versionName);
    this.consonance = this.launchService.getConsonanceString(toolPath, versionName);
  }

}
