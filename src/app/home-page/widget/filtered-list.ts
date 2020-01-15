import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserQuery } from 'app/shared/user/user.query';
import { Base } from 'app/shared/base';
import { EntriesService, UsersService } from '../../shared/openapi';

/**
 * Base class for logged in homepage widgets that have a filter list
 */
export abstract class FilteredList extends Base implements OnInit {
  userId$: Observable<number>;
  public hasItems = false;
  public firstCall = true;
  public myItems;
  public filterText;
  public isLoading = true;

  constructor(protected userQuery: UserQuery, protected entriesService: EntriesService, protected usersService: UsersService) {
    super();
  }

  ngOnInit() {
    this.getMyList();
  }

  onTextChange(event: any) {
    this.getMyList();
  }

  abstract getMyList();
}
