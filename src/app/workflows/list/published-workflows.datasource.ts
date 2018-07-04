/*
 *     Copyright 2018 OICR
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, finalize } from 'rxjs/operators';

import { ExtendedWorkflow } from '../../shared/models/ExtendedWorkflow';
import { ProviderService } from '../../shared/provider.service';
import { Workflow, WorkflowsService } from '../../shared/swagger';

@Injectable()
export class PublishedWorkflowsDataSource implements DataSource<ExtendedWorkflow> {

  private entriesSubject$ = new BehaviorSubject<ExtendedWorkflow[]>([]);
  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  public entriesLengthSubject$ = new BehaviorSubject<number>(0);
  public loading$ = this.loadingSubject$.asObservable();

  constructor(private workflowsService: WorkflowsService, private providersService: ProviderService) {
  }

  loadEntries(filter: string,
    sortDirection: string,
    pageIndex: number,
    pageSize: number,
    sortCol: string) {
    this.loadingSubject$.next(true);
    this.workflowsService.allPublishedWorkflows(pageIndex.toString(), pageSize, filter, sortCol, sortDirection, 'response').pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject$.next(false))
    )
      .subscribe((lessons: HttpResponse<Array<Workflow>>) => {
        this.entriesSubject$.next(lessons.body.map(tool => {
          return <ExtendedWorkflow>this.providersService.setUpProvider(tool);
        }));
        this.entriesLengthSubject$.next(Number(lessons.headers.get('X-total-count')));
      });
  }

  connect(collectionViewer: CollectionViewer): Observable<Workflow[]> {
    return this.entriesSubject$.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.entriesSubject$.complete();
    this.loadingSubject$.complete();
  }
}
