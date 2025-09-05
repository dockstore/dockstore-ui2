import { Injectable } from '@angular/core';
import { Order, QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { NotificationsState, NotificationsStore } from './notifications.store';
import { PublicNotification } from 'app/shared/openapi';

@Injectable({ providedIn: 'root' })
export class NotificationsQuery extends QueryEntity<NotificationsState> {
  allNotifications$: Observable<Array<PublicNotification>> = this.selectAll({
    // sort notifications, those expiring the soonest last
    sortBy: 'expiration',
    sortByOrder: Order.DESC,
  });

  constructor(protected store: NotificationsStore) {
    super(store);
  }
}
