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
import { Component } from '@angular/core';
import { AlertQuery } from '../../shared/alert/state/alert.query';
import { AlertService } from '../../shared/alert/state/alert.service';
import { ContainerService } from '../../shared/container.service';
import { RefreshOrganizationComponent } from '../../shared/refresh-organization/refresh-organization.component';
import { UsersService } from '../../shared/swagger/api/users.service';
import { DockstoreTool } from '../../shared/swagger/model/dockstoreTool';
import { UserQuery } from '../../shared/user/user.query';

@Component({
  selector: 'app-refresh-tool-organization',
  // Note that the template and style is actually from the shared one (used by both my-workflows and my-tools)
  templateUrl: './../../shared/refresh-organization/refresh-organization.component.html',
  styleUrls: ['./../../shared/refresh-organization/refresh-organization.component.css']
})
export class RefreshToolOrganizationComponent extends RefreshOrganizationComponent {
  constructor(
    userQuery: UserQuery,
    private alertService: AlertService,
    private usersService: UsersService,
    private containerService: ContainerService,
    protected alertQuery: AlertQuery
  ) {
    super(userQuery, alertQuery);
    this.buttonText = 'Refresh Namespace';
  }

  refreshOrganization(): void {
    const message = 'Refreshing ' + this.organization;
    this.alertService.start(message);
    this.usersService.refreshToolsByOrganization(this.userId, this.organization).subscribe(
      (success: DockstoreTool[]) => {
        this.containerService.setTools(success);
        this.alertService.detailedSuccess();
      },
      error => this.alertService.detailedError(error)
    );
  }
}
