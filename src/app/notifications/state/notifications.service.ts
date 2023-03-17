import { Injectable } from '@angular/core';
import { ID, Order } from '@datorama/akita';
import { CurationService } from '../../shared/swagger/api/curation.service';
import { Notification } from '../../shared/swagger/model/notification';
import { NotificationsStore } from './notifications.store';
import { NotificationsQuery } from '../../notifications/state/notifications.query';
import { Observable } from 'rxjs';

export interface DismissedNotification {
  id: number;
  expiration: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly storageKey = 'dismissedNotifications';
  public dismissedNotifications: Array<DismissedNotification> = JSON.parse(localStorage.getItem(this.storageKey) || '[]');

  constructor(
    private notificationsStore: NotificationsStore,
    private curationService: CurationService,
    private notificationsQuery: NotificationsQuery
  ) {}

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

  /**
   * Return observable for non-dismissed notifications, filter by notification type, sort by expiry date
   *
   * @param {Notification.TypeEnum} type    'SITEWIDE' or 'NEWSBODY'
   * @returns {Observable<Array<Notification>>}
   */
  getActiveNotificationsByType(type: Notification.TypeEnum): Observable<Array<Notification>> {
    return this.notificationsQuery.selectAll({
      sortBy: 'expiration',
      sortByOrder: Order.DESC,
      filterBy: (entity) => !this.dismissedNotifications.some((d) => entity.id === d.id) && entity.type === type,
    });
  }

  /**
   * Clean up localstorage by removing dismissed notifications that are now expired
   */
  removeExpiredDisabledNotifications() {
    const today = Date.now();
    this.dismissedNotifications = this.dismissedNotifications.filter((notification) => {
      return notification.expiration > today;
    });
    localStorage.setItem(this.storageKey, JSON.stringify(this.dismissedNotifications));
  }

  /**
   * Remove notification from localstorage
   */
  dismissNotification(notification: Notification) {
    this.dismissedNotifications.push({ id: notification.id, expiration: notification.expiration });
    localStorage.setItem(this.storageKey, JSON.stringify(this.dismissedNotifications));
    this.remove(notification.id);
  }
}
