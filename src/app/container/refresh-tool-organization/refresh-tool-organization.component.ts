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
    this.stateService.setRefreshing(true);
    this.usersService.refreshToolsByOrganization(this.userId, actualOrganization).subscribe(
      (success: DockstoreTool[]) => {
        this.containerService.setTools(success);
        this.stateService.setRefreshing(false);
      }, error => this.stateService.setRefreshing(false));
  }

}
