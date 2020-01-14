import { Component, OnInit } from '@angular/core';
import { NotificationsQuery } from '../../../notifications/state/notifications.query';
import { NotificationsService } from '../../../notifications/state/notifications.service';
import { Notification } from '../../../shared/swagger';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-news-updates',
  templateUrl: './news-updates.component.html',
  styleUrls: ['./news-updates.component.scss']
})
export class NewsUpdatesComponent implements OnInit {
  constructor(private notificationsQuery: NotificationsQuery, private notificationsService: NotificationsService) {}
  public allNotifications$: Observable<Array<Notification>>;
  public notificationTypeEnum = Notification.TypeEnum;

  ngOnInit() {
    this.notificationsService.getNotifications();
    this.allNotifications$ = this.notificationsQuery.allNotifications$;
  }
}
