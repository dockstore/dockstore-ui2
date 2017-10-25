import { ExtendedDockstoreTool } from './../../shared/models/ExtendedDockstoreTool';
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

import { ContainersService } from './../../shared/swagger/api/containers.service';
import { StateService } from './../../shared/state.service';
import { validationPatterns } from './../../shared/validationMessages.model';
import { InfoTabService } from './info-tab.service';
import { ContainerService } from './../../shared/container.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-tab',
  templateUrl: './info-tab.component.html',
  styleUrls: ['./info-tab.component.css']
})
export class InfoTabComponent implements OnInit {
  @Input() validVersions;
  @Input() defaultVersion;
  tool: ExtendedDockstoreTool;
  public validationPatterns = validationPatterns;
  dockerFileEditing: boolean;
  cwlPathEditing: boolean;
  wdlPathEditing: boolean;
  isPublic: boolean;
  constructor(private containerService: ContainerService, private infoTabService: InfoTabService, private stateService: StateService,
    private containersService: ContainersService) { }

  ngOnInit() {
    this.containerService.tool$.subscribe(tool => this.tool = tool);
    this.infoTabService.dockerFileEditing$.subscribe(editing => this.dockerFileEditing = editing);
    this.infoTabService.cwlPathEditing$.subscribe(editing => this.cwlPathEditing = editing);
    this.infoTabService.wdlPathEditing$.subscribe(editing => this.wdlPathEditing = editing);
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

  cancelEditing(): void {
    this.infoTabService.cancelEditing();
  }
}
