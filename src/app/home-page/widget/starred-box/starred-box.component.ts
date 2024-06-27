import { Component, OnInit } from '@angular/core';
import { Base } from 'app/shared/base';
import { Dockstore } from 'app/shared/dockstore.model';
import { UsersService } from 'app/shared/openapi';
import { RecentEventsComponent } from '../../recent-events/recent-events.component';
import { MatDividerModule } from '@angular/material/divider';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatLegacyCardModule } from '@angular/material/legacy-card';

@Component({
  selector: 'app-starred-box',
  templateUrl: './starred-box.component.html',
  styleUrls: ['./starred-box.component.scss', '../../../shared/styles/dashboard-boxes.scss'],
  standalone: true,
  imports: [MatLegacyCardModule, FlexModule, MatIconModule, RouterLink, NgIf, MatDividerModule, RecentEventsComponent],
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
