import { Component, OnInit } from '@angular/core';
import { UserQuery } from 'app/shared/user/user.query';
import { Observable } from 'rxjs';
import { DefaultService } from 'app/shared/openapi';
import { EntryUpdateTime } from 'app/shared/openapi/model/entryUpdateTime';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss']
})
export class EntriesComponent implements OnInit {
  public myEntries;
  public entryTypeEnum = EntryUpdateTime.EntryTypeEnum;
  public entryFilterText;
  userId$: Observable<number>;

  constructor(private userQuery: UserQuery, private defaultService: DefaultService) {}

  ngOnInit() {
    this.userId$ = this.userQuery.userId$;
    this.userQuery.userId$.subscribe((userId: number) => {
      this.getMyEntries(userId);
    });
  }

  getMyEntries(userId: number): void {
    this.defaultService.getUserEntries(userId, 10, this.entryFilterText).subscribe(
      (myWorkflows: Array<EntryUpdateTime>) => {
        this.myEntries = myWorkflows;
      },
      () => {}
    );
  }

  onTextChange(event: any) {
    this.userQuery.userId$.subscribe((userId: number) => {
      this.getMyEntries(userId);
    });
  }
}
