import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserQuery } from 'app/shared/user/user.query';
import { DefaultService } from 'app/shared/openapi';
import { Base } from 'app/shared/base';

/**
 * Base class for logged in homepage widgets that have a filter list
 */
export abstract class FilteredList extends Base implements OnInit {
  userId$: Observable<number>;
  public hasItems = false;
  public firstCall = true;
  public myItems;
  public filterText;

  constructor(protected userQuery: UserQuery, protected defaultService: DefaultService) {
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
