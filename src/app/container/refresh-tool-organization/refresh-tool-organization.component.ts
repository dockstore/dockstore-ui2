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

import { DockstoreTool } from './../../shared/swagger/model/dockstoreTool';
import { ContainerService } from './../../shared/container.service';
import { ContainersService } from './../../shared/swagger/api/containers.service';
import { UsersService } from './../../shared/swagger/api/users.service';
import { StateService } from './../../shared/state.service';
import { UserService } from './../../loginComponents/user.service';
import { RefreshOrganizationComponent } from './../../shared/refresh-organization/refresh-organization.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-refresh-tool-organization',
  // Note that the template and style is actually from the shared one (used by both my-workflows and my-tools)
  templateUrl: './../../shared/refresh-organization/refresh-organization.component.html',
  styleUrls: ['./../../shared/refresh-organization/refresh-organization.component.css']
})
export class RefreshToolOrganizationComponent extends RefreshOrganizationComponent {

  constructor(userService: UserService, public stateService: StateService, private usersService: UsersService,
    private containerService: ContainerService) {
    super(userService, stateService);
  }

  refreshOrganization(): void {
    const splitOrganization: string[] = this.organization.split('/');
    const actualOrganization: string = splitOrganization[1];
    this.stateService.setRefreshMessage('Refreshing ' + actualOrganization + '...');
    this.usersService.refreshToolsByOrganization(this.userId, actualOrganization).subscribe(
      (success: DockstoreTool[]) => {
        this.containerService.setTools(success);
        this.stateService.setRefreshMessage(null);
      }, error => this.stateService.setRefreshMessage(null));
  }

}
