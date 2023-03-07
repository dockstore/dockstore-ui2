import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from '../shared/swagger/model/notification';
import { NotificationsService } from './state/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  public activeNotifications$: Observable<Array<Notification>>;

  constructor(private notificationsService: NotificationsService) {
    this.activeNotifications$ = this.notificationsService.getActiveNotificationsByType(Notification.TypeEnum.SITEWIDE);
  }

  ngOnInit() {
    this.notificationsService.getNotifications();
    this.notificationsService.removeExpiredDisabledNotifications();
  }

  dismissNotification(notification: Notification) {
    this.notificationsService.dismissNotification(notification);
  }
}
