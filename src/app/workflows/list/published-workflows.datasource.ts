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
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Workflow, WorkflowsService } from '../../shared/swagger';
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ProviderService } from '../../shared/provider.service';
import { ExtendedWorkflow } from '../../shared/models/ExtendedWorkflow';

@Injectable()
export class PublishedWorkflowsDataSource {

  private lessonsSubject = new BehaviorSubject<ExtendedWorkflow[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public lessonsLengthSubject$ = new BehaviorSubject<number>(0);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private workflowsService: WorkflowsService, private providersService: ProviderService) {
  }

  loadLessons(filter: string,
    sortDirection: string,
    pageIndex: number,
    pageSize: number,
    sortCol: string) {

    this.loadingSubject.next(true);

    this.workflowsService.allPublishedWorkflows(pageIndex.toString(), pageSize, filter, sortCol, sortDirection, 'response').pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe((lessons: HttpResponse<Array<Workflow>>) => {
        this.lessonsSubject.next(lessons.body.map(tool => {
          return <ExtendedWorkflow>this.providersService.setUpProvider(tool);
        }));
        this.lessonsLengthSubject$.next(Number(lessons.headers.get('X-total-count')));
      });

  }

  connect(collectionViewer: CollectionViewer): Observable<Workflow[]> {
    console.log('Connecting data source');
    return this.lessonsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.lessonsSubject.complete();
    this.loadingSubject.complete();
  }


}
