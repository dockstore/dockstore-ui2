/*
 *     Copyright 2024 OICR, UCSC
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
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { WorkflowsService, WorkflowVersion } from '../../shared/openapi';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class VersionsDataSource implements DataSource<WorkflowVersion> {
  private versionsSubject$ = new BehaviorSubject<WorkflowVersion[]>([]);
  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  public versionsLengthSubject$ = new BehaviorSubject<number>(0);
  public loading$ = this.loadingSubject$.asObservable();

  constructor(private workflowsService: WorkflowsService) {}

  /**
   * Updates the datasource from the endpoint
   * @param {string} filter  A string to filter path by ("cgpmap")
   * @param {string} sortDirection  "asc" or "desc"
   * @param {number} pageIndex  The entry number to start listing from (page size * page number)
   * @param {number} pageSize  The page size (number of tools to return)
   * @param {string} sortCol  The column to sort by ("stars")
   * @memberof PublishedWorkflowsDataSource
   */
  loadVersions(
    publicPage: boolean,
    workflowId: number,
    sortDirection: 'asc' | 'desc',
    pageIndex: number,
    pageSize: number,
    sortCol: string
  ) {
    this.loadingSubject$.next(true);
    let workflowVersions: Observable<HttpResponse<WorkflowVersion[]>>;

    if (publicPage) {
      workflowVersions = this.workflowsService.getPublicWorkflowVersions(
        workflowId,
        pageSize,
        pageIndex,
        sortCol,
        sortDirection,
        'response'
      );
    } else {
      workflowVersions = this.workflowsService.getWorkflowVersions(workflowId, pageSize, pageIndex, sortCol, sortDirection, 'response');
    }

    workflowVersions.pipe(finalize(() => this.loadingSubject$.next(false))).subscribe((versions) => {
      this.versionsSubject$.next(versions.body);
      this.versionsLengthSubject$.next(Number(versions.headers.get('X-total-count')));
    });
  }

  connect(collectionViewer: CollectionViewer): Observable<WorkflowVersion[]> {
    return this.versionsSubject$.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.versionsSubject$.complete();
    this.loadingSubject$.complete();
  }
}
