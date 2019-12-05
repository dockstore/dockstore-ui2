import { Component } from '@angular/core';
import { UserQuery } from 'app/shared/user/user.query';
import { DefaultService } from 'app/shared/openapi';
import { EntryUpdateTime } from 'app/shared/openapi/model/entryUpdateTime';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { formInputDebounceTime } from 'app/shared/constants';
import { FilteredList } from '../filtered-list';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss']
})
export class EntriesComponent extends FilteredList {
  public entryTypeEnum = EntryUpdateTime.EntryTypeEnum;
  constructor(userQuery: UserQuery, defaultService: DefaultService) {
    super(userQuery, defaultService);
  }

  getMyList(): void {
    this.defaultService
      .getUserEntries(10, this.filterText)
      .pipe(
        debounceTime(formInputDebounceTime),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        (myEntries: Array<EntryUpdateTime>) => {
          this.myItems = myEntries;
          if (this.firstCall && this.myItems && this.myItems.length > 0) {
            this.hasItems = true;
            this.firstCall = false;
          }
        },
        () => {}
      );
  }
}
