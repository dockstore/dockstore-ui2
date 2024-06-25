import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from '../shared/openapi/model/notification';
import { NotificationsService } from './state/notifications.service';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MarkdownWrapperComponent } from '../shared/markdown-wrapper/markdown-wrapper.component';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { NgFor, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-sitewide-notifications',
  templateUrl: './sitewide-notifications.component.html',
  styleUrls: ['./sitewide-notifications.component.scss'],
  standalone: true,
  imports: [NgFor, FlexModule, MarkdownWrapperComponent, MatLegacyButtonModule, MatIconModule, AsyncPipe],
})
export class SitewideNotificationsComponent implements OnInit {
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
