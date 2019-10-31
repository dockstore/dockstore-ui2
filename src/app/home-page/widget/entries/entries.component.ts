import { Component, OnInit } from '@angular/core';
import { UserQuery } from 'app/shared/user/user.query';
import { Observable, Subject } from 'rxjs';
import { DefaultService } from 'app/shared/openapi';
import { EntryUpdateTime } from 'app/shared/openapi/model/entryUpdateTime';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { formInputDebounceTime } from 'app/shared/constants';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss']
})
export class EntriesComponent implements OnInit {
  public myEntries;
  public entryTypeEnum = EntryUpdateTime.EntryTypeEnum;
  public entryFilterText;
  public hasEntries = false;
  public firstCall = true;
  userId$: Observable<number>;
  protected ngUnsubscribe: Subject<{}> = new Subject();

  constructor(private userQuery: UserQuery, private defaultService: DefaultService) {}

  ngOnInit() {
    this.userId$ = this.userQuery.userId$;
    this.userQuery.userId$.subscribe((userId: number) => {
      this.getMyEntries();
    });
  }

  getMyEntries(): void {
    this.defaultService
      .getUserEntries(10, this.entryFilterText)
      .pipe(
        debounceTime(formInputDebounceTime),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        (myEntries: Array<EntryUpdateTime>) => {
          this.myEntries = myEntries;
          if (this.firstCall && this.myEntries && this.myEntries.length > 0) {
            this.hasEntries = true;
            this.firstCall = false;
          }
        },
        () => {}
      );
  }

  onTextChange(event: any) {
    this.userQuery.userId$.subscribe((userId: number) => {
      this.getMyEntries();
    });
  }
}
