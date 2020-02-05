import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from '../shared/swagger/model/notification';
import { NotificationsQuery } from './state/notifications.query';
import { NotificationsService } from './state/notifications.service';

interface DismissedNotification {
  id: number;
  expiration: Date;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  constructor(notificationsQuery: NotificationsQuery, private notificationsService: NotificationsService) {
    this.activeNotifications$ = notificationsQuery.selectAll({
      filterBy: entity => !this.dismissedNotifications.some(d => entity.id === d.id)
    });
  }
  public activeNotifications$: Observable<Array<Notification>>;
  private readonly storageKey = 'dismissedNotifications';
  public dismissedNotifications: Array<DismissedNotification> = JSON.parse(localStorage.getItem(this.storageKey) || '[]');

  ngOnInit() {
    this.notificationsService.getNotifications();
    this.removeExpiredDisabledNotifications();
  }

  /**
   * Clean up localstorage by removing dismissed notifications that are now expired
   */
  removeExpiredDisabledNotifications() {
    const today = Date.now();
    this.dismissedNotifications = this.dismissedNotifications.filter(notification => {
      return new Date(notification.expiration).getTime() > today;
    });
    localStorage.setItem(this.storageKey, JSON.stringify(this.dismissedNotifications));
  }

  dismissNotification(notification: Notification) {
    this.dismissedNotifications.push({ id: notification.id, expiration: notification.expiration });
    localStorage.setItem(this.storageKey, JSON.stringify(this.dismissedNotifications));
    this.notificationsService.remove(notification.id);
  }
}
