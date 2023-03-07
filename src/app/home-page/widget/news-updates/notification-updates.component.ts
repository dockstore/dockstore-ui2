import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsService } from '../../../notifications/state/notifications.service';
import { Notification } from '../../../shared/swagger';

@Component({
  selector: 'app-notification-updates',
  templateUrl: './notification-updates.component.html',
  styleUrls: ['./notification-updates.component.scss'],
})
export class NotificationUpdatesComponent implements OnInit {
  public activeNotifications$: Observable<Array<Notification>>;

  constructor(private notificationsService: NotificationsService) {
    this.activeNotifications$ = this.notificationsService.getActiveNotificationsByType(Notification.TypeEnum.NEWSBODY);
  }

  ngOnInit() {
    this.notificationsService.getNotifications();
    this.notificationsService.removeExpiredDisabledNotifications();
  }

  dismissNotification(notification: Notification) {
    this.notificationsService.dismissNotification(notification);
  }
}
