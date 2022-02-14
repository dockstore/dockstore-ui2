import { Component } from '@angular/core';
import { Dockstore } from '../../../shared/dockstore.model';
import { OrganizationUpdateTime } from 'app/shared/openapi/model/organizationUpdateTime';
import { UserQuery } from 'app/shared/user/user.query';
import { takeUntil } from 'rxjs/operators';
import { EntriesService, UsersService } from '../../../shared/openapi';
import { FilteredList } from '../filtered-list';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss'],
})
export class OrganizationsComponent extends FilteredList {
  Dockstore = Dockstore;

  constructor(userQuery: UserQuery, usersService: UsersService, entriesService: EntriesService) {
    super(userQuery, entriesService, usersService);
  }

  getMyList(): void {
    this.usersService
      .getUserDockstoreOrganizations(10, this.filterText)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (myOrganizations: Array<OrganizationUpdateTime>) => {
          this.myItems = myOrganizations;
          if (this.firstCall && this.myItems && this.myItems.length > 0) {
            this.hasItems = true;
            this.firstCall = false;
          }
          this.isLoading = false;
        },
        () => {}
      );
  }
}
