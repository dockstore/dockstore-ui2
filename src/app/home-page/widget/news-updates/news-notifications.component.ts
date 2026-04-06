import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsService } from '../../../notifications/state/notifications.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MarkdownWrapperComponent } from '../../../shared/markdown-wrapper/markdown-wrapper.component';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatCardModule } from '@angular/material/card';
import { NgFor, AsyncPipe } from '@angular/common';
import { PublicNotification } from 'app/shared/openapi';

@Component({
  selector: 'app-news-notifications',
  templateUrl: './news-notifications.component.html',
  styleUrls: ['./news-notifications.component.scss'],
  standalone: true,
  imports: [NgFor, MatCardModule, FlexModule, MarkdownWrapperComponent, MatButtonModule, MatIconModule, AsyncPipe],
})
export class NewsNotificationsComponent implements OnInit {
  public activeNotifications$: Observable<Array<PublicNotification>>;

  constructor(private notificationsService: NotificationsService) {
    this.activeNotifications$ = this.notificationsService.getActiveNotificationsByType(PublicNotification.TypeEnum.NEWSBODY);
  }

  ngOnInit() {
    this.notificationsService.getNotifications();
    this.notificationsService.removeExpiredDisabledNotifications();
  }

  dismissNotification(notification: PublicNotification) {
    this.notificationsService.dismissNotification(notification);
  }
}
