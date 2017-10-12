import { RefreshService } from '../../shared/refresh.service';
import { NotificationsService } from 'angular2-notifications';
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
import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { ContainerService } from './../../shared/container.service';
import { DateService } from '../../shared/date.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { StateService } from './../../shared/state.service';
import { Versions } from '../../shared/versions';

@Component({
  selector: 'app-versions-container',
  templateUrl: './versions.component.html',
  styleUrls: [ './versions.component.css' ]
})
export class VersionsContainerComponent extends Versions implements OnInit {
  @Input() versions: Array<any>;
  @Input() verifiedSource: Array<any>;
  verifiedLink: string;
  publicPage: boolean;
  defaultVersion: string;
  tool: any;

  constructor(dockstoreService: DockstoreService, private containersService: ContainersService,
    dateService: DateService, private refreshService: RefreshService,
              private stateService: StateService,
              private containerService: ContainerService) {
    super(dockstoreService, dateService);
    this.verifiedLink = dateService.getVerifiedLink();
  }

  ngOnInit() {
    this.stateService.publicPage$.subscribe(publicPage => this.publicPage = publicPage);
    this.containerService.tool$.subscribe(tool => {
      this.tool = tool;
      if (tool) {
        this.defaultVersion = tool.defaultVersion;
      }
    });
  }

  setNoOrderCols(): Array<number> {
    return [ 5, 6 ];
  }

  updateDefaultVersion(newDefaultVersion: string) {
    const message = 'Updating default tool version';
    this.tool.defaultVersion = newDefaultVersion;
    this.stateService.setRefreshMessage(message + '...');
    this.containersService.updateContainer(this.tool.id, this.tool).subscribe(response => {
      this.containerService.setTool(response);
      this.refreshService.handleSuccess(message);
    }, error => this.refreshService.handleError(message, error)
  );
  }

  getVerifiedSource(name: string) {
    this.dockstoreService.getVerifiedSource(name, this.verifiedSource);
  }
}
