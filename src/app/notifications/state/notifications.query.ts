import { Injectable } from '@angular/core';
import { Order, QueryEntity } from '@datorama/akita';
import { NotificationsStore, NotificationsState } from './notifications.store';
import { Notification } from '../../shared/swagger/model/notification';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsQuery extends QueryEntity<NotificationsState> {
  allNotifications$: Observable<Array<Notification>> = this.selectAll({
    // sort notifications, those expiring the soonest last
    sortBy: 'expiration',
    sortByOrder: Order.DESC
  });

  constructor(protected store: NotificationsStore) {
    super(store);
  }
}
