import { Injectable } from '@angular/core';
import { ID, Order } from '@datorama/akita';
import { CurationService } from '../../shared/openapi/api/curation.service';
import { NotificationsStore } from './notifications.store';
import { NotificationsQuery } from '../../notifications/state/notifications.query';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PublicNotification } from 'app/shared/openapi/model/publicNotification';
import { GitHubAppNotification, UserNotification } from 'app/shared/openapi';
import { HttpResponse } from '@angular/common/http';

export interface DismissedNotification {
  id: number;
  expiration: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly storageKey = 'dismissedNotifications';
  public dismissedNotifications: Array<DismissedNotification> = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  public userNotificationsCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    private notificationsStore: NotificationsStore,
    private curationService: CurationService,
    private notificationsQuery: NotificationsQuery
  ) {}

  getNotifications() {
    this.curationService
      .getActiveNotifications()
      .subscribe((notificationsCollection: Array<PublicNotification>) => this.notificationsStore.set(notificationsCollection));
  }

  add(notification: PublicNotification) {
    this.notificationsStore.add(notification);
  }

  update(id: ID, notification: Partial<PublicNotification>) {
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
  getActiveNotificationsByType(type: PublicNotification.TypeEnum): Observable<Array<PublicNotification>> {
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
  dismissNotification(notification: PublicNotification) {
    this.dismissedNotifications.push({ id: notification.id, expiration: notification.expiration });
    localStorage.setItem(this.storageKey, JSON.stringify(this.dismissedNotifications));
    this.remove(notification.id);
  }

  getUserNotifications(pageIndex: number, pageSize: number): Observable<HttpResponse<UserNotification[]>> {
    return this.curationService.getUserNotifications(pageIndex, pageSize, 'response').pipe(
      tap((response: HttpResponse<UserNotification[]>) => {
        // Extract the count from the response header and update the corresponding Observable
        const count = Number(response.headers.get('X-total-count'));
        this.userNotificationsCount$.next(count);
      })
    );
  }

  getGitHubAppNotifications(pageIndex: number, pageSize: number): Observable<HttpResponse<GitHubAppNotification[]>> {
    return this.curationService.getGitHubAppNotifications(pageIndex, pageSize, 'response');
  }

  loadUserNotificationsCount() {
    // The following call will update the userNotificationsCount$ Observable
    this.getUserNotifications(0, 1).subscribe(() => {});
  }
}
