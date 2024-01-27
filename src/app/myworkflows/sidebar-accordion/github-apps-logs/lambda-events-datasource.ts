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
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AlertService } from '../../../shared/alert/state/alert.service';
import { LambdaEvent, LambdaEventsService } from '../../../shared/openapi';

export type ShowContent = 'table' | 'error' | 'empty' | 'noResult' | null;

export class LambdaEventDataSource implements DataSource<LambdaEvent> {
  private eventsSubject$ = new BehaviorSubject<LambdaEvent[]>([]);
  private loadingSubject$ = new BehaviorSubject<boolean>(true);
  private eventsLengthSubject$ = new BehaviorSubject<number>(0);
  private showContentSubject$ = new BehaviorSubject<ShowContent>(null);

  public events$ = this.eventsSubject$.asObservable();
  public loading$ = this.loadingSubject$.asObservable();
  public eventsLength$ = this.eventsLengthSubject$.asObservable();
  public showContent$ = this.showContentSubject$.asObservable();

  constructor(private lambdaEventsService: LambdaEventsService) {}
  connect(collectionViewer: CollectionViewer): Observable<readonly LambdaEvent[]> {
    return this.events$;
  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.eventsSubject$.complete();
  }

  loadEvents(
    pageIndex: number,
    pageSize: number,
    filter: string | null,
    sortDirection: string,
    sortCol: string,
    userId: number | null,
    organization: string
  ) {
    const filtered = filter?.length > 0;
    let lambdaEvents: Observable<HttpResponse<LambdaEvent[]>>;
    if (userId) {
      lambdaEvents = this.lambdaEventsService.getUserLambdaEvents(userId, pageIndex, pageSize, filter, sortCol, sortDirection, 'response');
    } else {
      lambdaEvents = this.lambdaEventsService.getLambdaEventsByOrganization(
        organization,
        pageIndex,
        pageSize,
        filter,
        sortCol,
        sortDirection,
        'response'
      );
    }
    lambdaEvents
      .pipe(
        finalize(() => {
          this.loadingSubject$.next(false);
          // this.updateContentToShow(this.lambdaEvents, filtered);
        })
      )
      .subscribe(
        (response) => {
          const events: LambdaEvent[] = response.body;
          this.eventsSubject$.next(events);
          this.eventsLengthSubject$.next(Number(response.headers.get('X-total-count')));
          this.showContentSubject$.next(this.calculateShowContent(events.length, filter?.length > 0));
        },
        (error) => {
          this.showContentSubject$.next('error');
          this.eventsSubject$.error(error);
          // this.matSnackBar.open(detailedErrorMessage);
        }
      );
  }

  private calculateShowContent(eventsLength: number, filtered: boolean): ShowContent {
    if (eventsLength === 0) {
      return filtered ? 'noResult' : 'empty';
    }
    return 'table';
  }
}
