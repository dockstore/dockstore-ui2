import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { HttpClient } from '@angular/common/http';
import { NotificationsStore } from './notifications.store';
import { Notification } from '../../shared/swagger/model/notification';
import { CurationService } from '../../shared/swagger/api/curation.service';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  constructor(private notificationsStore: NotificationsStore, private curationService: CurationService) {}

  getNotifications() {
    this.curationService.getActiveNotifications().subscribe((notificationsCollection: Array<Notification>) => {
      this.notificationsStore.update(state => {
        return {
          ...state,
          notifications: notificationsCollection
        };
      });
    });
  }

  add(notification: Notification) {
    this.notificationsStore.add(notification);
  }

  update(id, notification: Partial<Notification>) {
    this.notificationsStore.update(id, notification);
  }

  remove(id: ID) {
    this.notificationsStore.remove(id);
  }
}
