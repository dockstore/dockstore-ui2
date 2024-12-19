import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsService } from '../../../notifications/state/notifications.service';
import { Notification } from '../../../shared/openapi';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MarkdownWrapperComponent } from '../../../shared/markdown-wrapper/markdown-wrapper.component';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatCardModule } from '@angular/material/card';
import { NgFor, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-news-notifications',
  templateUrl: './news-notifications.component.html',
  styleUrls: ['./news-notifications.component.scss'],
  standalone: true,
  imports: [NgFor, MatCardModule, FlexModule, MarkdownWrapperComponent, MatButtonModule, MatIconModule, AsyncPipe],
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
