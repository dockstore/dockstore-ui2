import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { CurationService } from '../../shared/swagger/api/curation.service';
import { Notification } from '../../shared/swagger/model/notification';
import { NotificationsStore } from './notifications.store';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  constructor(private notificationsStore: NotificationsStore, private curationService: CurationService) {}

  getNotifications() {
    this.curationService
      .getActiveNotifications()
      .subscribe((notificationsCollection: Array<Notification>) => this.notificationsStore.set(notificationsCollection));
  }

  add(notification: Notification) {
    this.notificationsStore.add(notification);
  }

  update(id: ID, notification: Partial<Notification>) {
    this.notificationsStore.update(id, notification);
  }

  remove(id: ID) {
    this.notificationsStore.remove(id);
  }
}
