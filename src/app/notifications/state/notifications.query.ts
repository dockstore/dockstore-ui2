import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { NotificationsStore, NotificationsState } from './notifications.store';
import { Notification } from '../../shared/swagger/model/notification';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsQuery extends QueryEntity<NotificationsState> {
  allNotifications$: Observable<Array<Notification>> = this.select(state => state.notifications);

  constructor(protected store: NotificationsStore) {
    super(store);
  }
}
