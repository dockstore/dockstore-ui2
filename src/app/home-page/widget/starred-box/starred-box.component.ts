import { Component, OnInit } from '@angular/core';
import { Base } from 'app/shared/base';
import { Dockstore } from 'app/shared/dockstore.model';
import { UsersService } from 'app/shared/openapi';

@Component({
  selector: 'app-starred-box',
  templateUrl: './starred-box.component.html',
  styleUrls: ['./starred-box.component.scss', '../../../shared/styles/dashboard-boxes.scss'],
})
export class StarredBoxComponent extends Base implements OnInit {
  public Dockstore = Dockstore;
  public totalStarredWorkflows: number = 0;
  public totalStarredTools: number = 0;
  public totalStarredNotebooks: number = 0;
  public totalStarredServices: number = 0;
  public totalStarredOrganizations: number = 0;

  // Hides starred services, remove when implemented
  public serviceImplemented: boolean = false;

  constructor(private usersService: UsersService) {
    super();
  }

  ngOnInit(): void {
    this.usersService.getStarredWorkflows().subscribe((starredWorkflows) => {
      this.totalStarredWorkflows = starredWorkflows.length;
    });
    this.usersService.getStarredTools().subscribe((starredTools) => {
      this.totalStarredTools = starredTools.length;
    });
    this.usersService.getStarredNotebooks().subscribe((starredNotebooks) => {
      this.totalStarredNotebooks = starredNotebooks.length;
    });
    this.usersService.getStarredServices().subscribe((starredServices) => {
      this.totalStarredServices = starredServices.length;
    });
    this.usersService.getStarredOrganizations().subscribe((starredOrganizations) => {
      this.totalStarredOrganizations = starredOrganizations.length;
    });
  }
}
