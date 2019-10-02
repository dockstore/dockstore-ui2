import { Component, OnInit } from '@angular/core';
import { UsersService, OrganizationUser } from '../../../shared/swagger';
import { AlertService } from '../../../shared/alert/state/alert.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  public myOrganizationInvites;
  public myOrganizationRequests;
  constructor(private usersService: UsersService, private alertService: AlertService) {}

  ngOnInit() {
    this.getMyMemberships();
  }

  getMyMemberships(): void {
    this.usersService.getUserMemberships().subscribe(
      (myMemberships: Array<OrganizationUser>) => {
        this.myOrganizationInvites = myMemberships.filter(membership => !membership.accepted);
        this.myOrganizationRequests = myMemberships.filter(
          membership =>
            membership.accepted && (membership.organization.status === 'PENDING' || membership.organization.status === 'REJECTED')
        );

        this.alertService.simpleSuccess();
      },
      () => {
        this.alertService.simpleError();
      }
    );
  }
}
