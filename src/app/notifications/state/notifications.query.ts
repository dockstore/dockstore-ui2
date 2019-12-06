import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { NotificationsStore, NotificationsState } from './notifications.store';
import { Notification } from '../../shared/swagger/model/notification';
import { Observable } from 'rxjs';
import { first, map, mergeMap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NotificationsQuery extends QueryEntity<NotificationsState> {
  allNotifications$: Observable<Array<Notification>> = this.select(state => state.notifications);
  //mostRecentNotification$: Observable<Notification> = this.allNotifications$.pipe(first(), mergeMap(x => {console.log(x); return x;}));

  constructor(protected store: NotificationsStore) {
    super(store);
  }
}
