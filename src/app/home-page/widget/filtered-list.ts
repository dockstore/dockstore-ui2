import { OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UserQuery } from 'app/shared/user/user.query';
import { DefaultService } from 'app/shared/openapi';

/**
 * Base class for logged in homepage widgets that have a filter list
 */
export abstract class FilteredList implements OnInit {
  userId$: Observable<number>;
  protected ngUnsubscribe: Subject<{}> = new Subject();
  public hasItems = false;
  public firstCall = true;
  public myItems;
  public filterText;

  constructor(protected userQuery: UserQuery, protected defaultService: DefaultService) {}

  ngOnInit() {
    this.getMyList();
  }

  onTextChange(event: any) {
    this.getMyList();
  }

  abstract getMyList();
}
