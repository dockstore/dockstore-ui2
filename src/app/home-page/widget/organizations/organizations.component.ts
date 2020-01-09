import { Component } from '@angular/core';
import { UserQuery } from 'app/shared/user/user.query';
import { OrganizationUpdateTime } from 'app/shared/openapi/model/organizationUpdateTime';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { formInputDebounceTime } from 'app/shared/constants';
import { FilteredList } from '../filtered-list';
import { EntriesService, UsersService } from '../../../shared/openapi';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss']
})
export class OrganizationsComponent extends FilteredList {
  constructor(userQuery: UserQuery, usersService: UsersService, entriesService: EntriesService) {
    super(userQuery, entriesService, usersService);
  }

  getMyList(): void {
    this.usersService
      .getUserDockstoreOrganizations(10, this.filterText)
      .pipe(
        debounceTime(formInputDebounceTime),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        (myOrganizations: Array<OrganizationUpdateTime>) => {
          this.myItems = myOrganizations;
          if (this.firstCall && this.myItems && this.myItems.length > 0) {
            this.hasItems = true;
            this.firstCall = false;
          }
        },
        () => {}
      );
  }
}
