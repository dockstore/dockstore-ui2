import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../../../shared/alert/state/alert.service';
import { Base } from '../../../shared/base';
import { Organization, OrganizationsService, OrganizationUser, UsersService } from '../../../shared/swagger';
import { UserQuery } from '../../../shared/user/user.query';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
})
export class RequestsComponent extends Base implements OnInit {
  public myOrganizationInvites: Array<OrganizationUser>;
  public myOrganizationRequests: Array<OrganizationUser>;
  public myPendingOrganizationRequests: Array<Organization>;

  isAdmin$: Observable<boolean>;
  isCurator$: Observable<boolean>;
  constructor(
    private usersService: UsersService,
    private alertService: AlertService,
    private userQuery: UserQuery,
    private organizationsService: OrganizationsService
  ) {
    super();
  }

  ngOnInit() {
    this.getMyMemberships();

    this.isAdmin$ = this.userQuery.isAdmin$;
    this.isCurator$ = this.userQuery.isCurator$;

    this.userQuery.isAdminOrCurator$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((isAdminOrCurator) => {
      if (isAdminOrCurator) {
        this.updateCuratorOrganizations(); // requires admin or curator permissions
      }
    });
  }

  updateCuratorOrganizations(): void {
    this.organizationsService.getAllOrganizations('pending').subscribe(
      (allPendingOrganizations: Array<Organization>) => {
        this.myPendingOrganizationRequests = allPendingOrganizations;
        this.alertService.simpleSuccess();
      },
      () => {
        this.alertService.simpleError();
      }
    );
  }

  getMyMemberships(): void {
    this.usersService.getUserMemberships().subscribe(
      (myMemberships: Array<OrganizationUser>) => {
        this.myOrganizationInvites = myMemberships.filter((membership) => membership.status === 'PENDING');
        this.myOrganizationRequests = myMemberships.filter(
          (membership) =>
            membership.status === 'ACCEPTED' &&
            (membership.organization.status === Organization.StatusEnum.PENDING ||
              membership.organization.status === Organization.StatusEnum.REJECTED)
        );

        this.alertService.simpleSuccess();
      },
      () => {
        this.alertService.simpleError();
      }
    );
  }
}
