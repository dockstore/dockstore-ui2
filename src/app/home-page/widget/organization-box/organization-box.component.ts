import { Component, OnInit } from '@angular/core';
import { Base } from 'app/shared/base';
import { Dockstore } from 'app/shared/dockstore.model';
import { EntriesService, OrganizationUpdateTime, UsersService } from 'app/shared/swagger';
import { UserQuery } from 'app/shared/user/user.query';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-organization-box',
  templateUrl: '/organization-box.component.html',
  styleUrls: ['/organization-box.component.scss'],
})
export class OrganizationBoxComponent extends Base implements OnInit {
  Dockstore = Dockstore;
  listOfOrganizations: Array<OrganizationUpdateTime> = [];
  filterText: string;
  firstCall = true;
  hasOrganizations = false;

  public isLoading = true;

  constructor(protected userQuery: UserQuery, protected usersService: UsersService, protected entriesService: EntriesService) {
    super();
  }

  ngOnInit(): void {
    this.getMyOrganizations();
  }

  getMyOrganizations() {
    this.usersService
      .getUserDockstoreOrganizations(5, this.filterText)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (myOrganizations: Array<OrganizationUpdateTime>) => {
          this.listOfOrganizations = myOrganizations;
          if (this.firstCall && this.listOfOrganizations && this.listOfOrganizations.length > 0) {
            this.hasOrganizations = true;
            this.firstCall = false;
          }
          this.isLoading = false;
        },
        () => {}
      );
  }
}
