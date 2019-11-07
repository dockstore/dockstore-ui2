import { Component } from '@angular/core';
import { UserQuery } from 'app/shared/user/user.query';
import { DefaultService } from 'app/shared/openapi';
import { OrganizationUpdateTime } from 'app/shared/openapi/model/organizationUpdateTime';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { formInputDebounceTime } from 'app/shared/constants';
import { FilteredList } from '../filtered-list';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss']
})
export class OrganizationsComponent extends FilteredList {
  constructor(userQuery: UserQuery, defaultService: DefaultService) {
    super(userQuery, defaultService);
  }

  getMyList(): void {
    this.defaultService
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
