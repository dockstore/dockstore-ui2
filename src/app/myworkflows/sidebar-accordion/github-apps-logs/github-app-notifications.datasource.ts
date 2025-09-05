/*
 *
 *  Copyright 2024 OICR and UCSC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GitHubAppNotification } from '../../../shared/openapi';
import { HttpResponse } from '@angular/common/http';
import { NotificationsService } from 'app/notifications/state/notifications.service';

export type ShowContent = 'table' | 'error' | 'empty' | 'noResult' | null;

export class GitHubAppNotificationsDataSource implements DataSource<GitHubAppNotification> {
  private gitHubAppNotificationsSubject$ = new BehaviorSubject<GitHubAppNotification[]>([]);
  private loadingSubject$ = new BehaviorSubject<boolean>(true);
  private gitHubAppNotificationsLengthSubject$ = new BehaviorSubject<number>(0);
  private showContentSubject$ = new BehaviorSubject<ShowContent>(null);

  public gitHubAppNotifications$ = this.gitHubAppNotificationsSubject$.asObservable();
  public loading$ = this.loadingSubject$.asObservable();
  public gitHubAppNotificationsLength$ = this.gitHubAppNotificationsLengthSubject$.asObservable();
  public showContent$ = this.showContentSubject$.asObservable();

  constructor(private notificationsService: NotificationsService) {}
  connect(collectionViewer: CollectionViewer): Observable<readonly GitHubAppNotification[]> {
    return this.gitHubAppNotifications$;
  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.gitHubAppNotificationsSubject$.complete();
  }

  loadEvents(pageIndex: number, pageSize: number) {
    let userNotifications: Observable<HttpResponse<GitHubAppNotification[]>>;
    this.loadingSubject$.next(true);
    userNotifications = this.notificationsService.getGitHubAppNotifications(pageIndex, pageSize);
    userNotifications
      .pipe(
        finalize(() => {
          this.loadingSubject$.next(false);
        })
      )
      .subscribe(
        (response) => {
          const notifications: GitHubAppNotification[] = response.body;
          this.gitHubAppNotificationsSubject$.next(notifications);
          this.gitHubAppNotificationsLengthSubject$.next(Number(response.headers.get('X-total-count')));
          this.showContentSubject$.next(this.calculateShowContent(notifications.length));
        },
        (error) => {
          this.showContentSubject$.next('error');
          this.gitHubAppNotificationsSubject$.error(error);
        }
      );
  }

  private calculateShowContent(eventsLength: number): ShowContent {
    if (eventsLength === 0) {
      return 'empty';
    }
    return 'table';
  }
}
