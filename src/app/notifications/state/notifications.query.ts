import { Injectable } from '@angular/core';
import { Order, QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { Notification } from '../../shared/swagger/model/notification';
import { NotificationsState, NotificationsStore } from './notifications.store';

@Injectable({ providedIn: 'root' })
export class NotificationsQuery extends QueryEntity<NotificationsState> {
  allNotifications$: Observable<Array<Notification>> = this.selectAll({
    // sort notifications, those expiring the soonest last
    sortBy: 'expiration',
    sortByOrder: Order.DESC,
  });

  constructor(protected store: NotificationsStore) {
    super(store);
  }
}
