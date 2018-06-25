/**
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
import { Component, Input, OnInit } from '@angular/core';

import { ContainerService } from './../../shared/container.service';
import { ExtendedDockstoreTool } from './../../shared/models/ExtendedDockstoreTool';
import { StateService } from './../../shared/state.service';
import { ContainersService } from './../../shared/swagger/api/containers.service';
import { exampleDescriptorPatterns, validationDescriptorPatterns } from './../../shared/validationMessages.model';
import { InfoTabService } from './info-tab.service';
import { DockstoreTool } from './../../shared/swagger/model/dockstoreTool';
import { Dockstore } from '../../shared/dockstore.model';
import { ga4ghPath } from './../../shared/constants';

@Component({
  selector: 'app-info-tab',
  templateUrl: './info-tab.component.html',
  styleUrls: ['./info-tab.component.css']
})
export class InfoTabComponent implements OnInit {
  currentVersion;
  @Input() set selectedVersion(value) {
    if (value != null && this.tool != null) {
      this.currentVersion = value;
      if (this.tool.descriptorType.includes('cwl')) {
        this.trsLinkCWL = this.getTRSLink(this.tool.tool_path, value.name, 'cwl');
      }
      if (this.tool.descriptorType.includes('wdl')) {
        this.trsLinkWDL = this.getTRSLink(this.tool.tool_path, value.name, 'wdl');
      }
    }
  }
  @Input() privateOnlyRegistry;
  @Input() tool;
  public validationPatterns = validationDescriptorPatterns;
  public exampleDescriptorPatterns = exampleDescriptorPatterns;
  public DockstoreToolType = DockstoreTool;
  dockerFileEditing: boolean;
  cwlPathEditing: boolean;
  wdlPathEditing: boolean;
  cwlTestPathEditing: boolean;
  wdlTestPathEditing: boolean;
  isPublic: boolean;
  trsLinkCWL: string;
  trsLinkWDL: string;
  constructor(private containerService: ContainerService, private infoTabService: InfoTabService, private stateService: StateService,
    private containersService: ContainersService) {
    }

  ngOnInit() {
    this.infoTabService.dockerFileEditing$.subscribe(editing => this.dockerFileEditing = editing);
    this.infoTabService.cwlPathEditing$.subscribe(editing => this.cwlPathEditing = editing);
    this.infoTabService.wdlPathEditing$.subscribe(editing => this.wdlPathEditing = editing);
    this.infoTabService.cwlTestPathEditing$.subscribe(editing => this.cwlTestPathEditing = editing);
    this.infoTabService.wdlTestPathEditing$.subscribe(editing => this.wdlTestPathEditing = editing);
    this.stateService.publicPage$.subscribe(publicPage => this.isPublic = publicPage);
  }

  toggleEditDockerFile() {
    if (this.dockerFileEditing) {
      this.infoTabService.updateAndRefresh(this.tool);
    }
    this.infoTabService.setDockerFileEditing(!this.dockerFileEditing);
  }

  toggleEditCWLPath() {
    if (this.cwlPathEditing) {
      this.infoTabService.updateAndRefresh(this.tool);
    }
    this.infoTabService.setCWLPathEditing(!this.cwlPathEditing);
  }

  toggleEditWDLPath() {
    if (this.wdlPathEditing) {
      this.infoTabService.updateAndRefresh(this.tool);
    }
    this.infoTabService.setWDLPathEditing(!this.wdlPathEditing);
  }

  toggleEditCWLTestPath() {
    if (this.cwlTestPathEditing) {
      this.infoTabService.updateAndRefresh(this.tool);
    }
    this.infoTabService.setCWLTestPathEditing(!this.cwlTestPathEditing);
  }
  toggleEditWDLTestPath() {
    if (this.wdlTestPathEditing) {
      this.infoTabService.updateAndRefresh(this.tool);
    }
    this.infoTabService.setWDLTestPathEditing(!this.wdlTestPathEditing);
  }

  somethingIsBeingEdited(): boolean {
    return this.dockerFileEditing || this.cwlPathEditing || this.wdlPathEditing || this.cwlTestPathEditing || this.wdlTestPathEditing;
  }

  /**
   * Cancel button function
   *
   * @memberof InfoTabComponent
   */
  cancelEditing(): void {
    this.infoTabService.cancelEditing();
  }


  /**
   * Returns a link to the primary descriptor for the given tool version
   * @param path tool path
   * @param versionName name of version
   * @param descriptorType descriptor type (CWL or WDL)
   */
  getTRSLink(path: string, versionName: string, descriptorType: string): string {
    return `${Dockstore.API_URI}${ga4ghPath}/tools/${encodeURIComponent(path)}` +
      `/versions/${encodeURIComponent(versionName)}/plain-` + descriptorType.toUpperCase() +
      `/descriptor`;
  }
}
