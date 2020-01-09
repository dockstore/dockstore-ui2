import { Component, OnInit } from '@angular/core';
import { Notification } from '../shared/swagger/model/notification';
import { NotificationsQuery } from './state/notifications.query';
import { NotificationsService } from './state/notifications.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface DismissedNotification {
  id: number;
  expiration: Date;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  constructor(private notificationsQuery: NotificationsQuery, private notificationsService: NotificationsService) {
    this.allNotifications$ = this.notificationsQuery.allNotifications$;
  }
  message: string;
  public allNotifications$: Observable<Array<Notification>>;
  private readonly storageKey = 'dismissedNotifications';
  public dismissedNotifications: Array<DismissedNotification> = JSON.parse(localStorage.getItem(this.storageKey) || '[]');

  ngOnInit() {
    this.notificationsService.getNotifications();
    this.removeExpiredDisabledNotifications(this.dismissedNotifications);
  }

  removeExpiredDisabledNotifications(notificationsStored: Array<DismissedNotification>) {
    const today = Date.now();
    this.dismissedNotifications = this.dismissedNotifications.filter(notification => {
      return new Date(notification.expiration).getTime() > today;
    });
    localStorage.setItem(this.storageKey, JSON.stringify(this.dismissedNotifications));
  }

  respondClick(notification: Notification) {
    this.dismissedNotifications.push({ id: notification.id, expiration: notification.expiration });
    localStorage.setItem(this.storageKey, JSON.stringify(this.dismissedNotifications));
    this.notificationsService.remove(notification.id);
  }

  notificationDismissed(notification: Notification): boolean {
    return this.dismissedNotifications.some(dismissedNotification => dismissedNotification.id === notification.id);
  }
}
