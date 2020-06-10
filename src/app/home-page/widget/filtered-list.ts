import {OnDestroy, OnInit} from '@angular/core';
import { Base } from 'app/shared/base';
import { UserQuery } from 'app/shared/user/user.query';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { EntriesService, UsersService } from '../../shared/openapi';

/**
 * Base class for logged in homepage widgets that have a filter list
 */
export abstract class FilteredList extends Base implements OnInit, OnDestroy {
  userId$: Observable<number>;
  public hasItems = false;
  public firstCall = true;
  public myItems;
  public filterText;
  public isLoading = true;
  protected ngUnsubscribe: Subject<{}> = new Subject();
  private subject: Subject<string> = new Subject();

  constructor(protected userQuery: UserQuery, protected entriesService: EntriesService, protected usersService: UsersService) {
    super();
  }

  ngOnInit() {
    this.getMyList();

    this.subject.pipe(
      // The usual argument formDebounceTime is set to 250 which is not long enough
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.ngUnsubscribe)
  ).subscribe(filterText => {
      this.getMyList();
    });
  }

  onTextChange(event: any) {
    this.subject.next(this.filterText);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  abstract getMyList();
}
