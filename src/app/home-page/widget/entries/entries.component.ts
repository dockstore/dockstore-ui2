import { Component } from '@angular/core';
import { EntryUpdateTime } from 'app/shared/openapi/model/entryUpdateTime';
import { UserQuery } from 'app/shared/user/user.query';
import { takeUntil } from 'rxjs/operators';
import { EntriesService, UsersService } from '../../../shared/openapi';
import { FilteredList } from '../filtered-list';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss']
})
export class EntriesComponent extends FilteredList {
  public entryTypeEnum = EntryUpdateTime.EntryTypeEnum;
  constructor(userQuery: UserQuery, usersService: UsersService, entriesService: EntriesService) {
    super(userQuery, entriesService, usersService);
  }

  getMyList(): void {
    this.usersService
      .getUserEntries(10, this.filterText)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        (myEntries: Array<EntryUpdateTime>) => {
          this.myItems = myEntries;
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
