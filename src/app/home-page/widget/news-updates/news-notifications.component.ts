import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsService } from '../../../notifications/state/notifications.service';
import { Notification } from '../../../shared/openapi';

@Component({
  selector: 'app-news-notifications',
  templateUrl: './news-notifications.component.html',
  styleUrls: ['./news-notifications.component.scss'],
})
export class NewsNotificationsComponent implements OnInit {
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
