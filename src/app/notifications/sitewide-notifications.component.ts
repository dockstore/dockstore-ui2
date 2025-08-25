import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsService } from './state/notifications.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MarkdownWrapperComponent } from '../shared/markdown-wrapper/markdown-wrapper.component';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { NgFor, AsyncPipe } from '@angular/common';
import { PublicNotification } from 'app/shared/openapi';

@Component({
  selector: 'app-sitewide-notifications',
  templateUrl: './sitewide-notifications.component.html',
  styleUrls: ['./sitewide-notifications.component.scss'],
  standalone: true,
  imports: [NgFor, FlexModule, MarkdownWrapperComponent, MatButtonModule, MatIconModule, AsyncPipe],
})
export class SitewideNotificationsComponent implements OnInit {
  public activeNotifications$: Observable<Array<PublicNotification>>;

  constructor(private notificationsService: NotificationsService) {
    this.activeNotifications$ = this.notificationsService.getActiveNotificationsByType(PublicNotification.TypeEnum.SITEWIDE);
  }

  ngOnInit() {
    this.notificationsService.getNotifications();
    this.notificationsService.removeExpiredDisabledNotifications();
  }

  dismissNotification(notification: PublicNotification) {
    this.notificationsService.dismissNotification(notification);
  }
}
