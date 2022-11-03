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
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { EntryType } from 'app/shared/enum/entry-type';
import { ImageProviderService } from '../../shared/image-provider.service';
import { ExtendedDockstoreTool } from '../../shared/models/ExtendedDockstoreTool';
import { ProviderService } from '../../shared/provider.service';
import { ContainersService, DockstoreTool } from '../../shared/swagger';

@Injectable()
export class PublishedToolsDataSource implements DataSource<ExtendedDockstoreTool> {
  private entriesSubject = new BehaviorSubject<ExtendedDockstoreTool[]>([]);
  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  public entriesLengthSubject$ = new BehaviorSubject<number>(0);
  public loading$ = this.loadingSubject$.asObservable();

  constructor(
    private containersService: ContainersService,
    private providersService: ProviderService,
    private imageProviderService: ImageProviderService
  ) {}

  /**
   * Updates the datasource from the endpoint
   * @param {string} filter  A string to filter path by ("cgpmap")
   * @param {string} sortDirection  "asc" or "desc"
   * @param {number} pageIndex  The entry number to start listing from (page size * page number)
   * @param {number} pageSize  The page size (number of tools to return)
   * @param {string} sortCol  The column to sort by ("stars")
   * @memberof PublishedToolsDataSource
   */
  loadEntries(entryType: EntryType, filter: string, sortDirection: 'asc' | 'desc', pageIndex: number, pageSize: number, sortCol: string) {
    this.loadingSubject$.next(true);
    this.containersService
      .allPublishedContainers(pageIndex, pageSize, filter, sortCol, sortDirection, 'response')
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject$.next(false))
      )
      .subscribe((entries: HttpResponse<Array<DockstoreTool>>) => {
        this.entriesSubject.next(
          entries.body.map((tool) => {
            tool = this.imageProviderService.setUpImageProvider(tool);
            return <ExtendedDockstoreTool>this.providersService.setUpProvider(tool);
          })
        );
        this.entriesLengthSubject$.next(Number(entries.headers.get('X-total-count')));
      });
  }

  connect(collectionViewer: CollectionViewer): Observable<DockstoreTool[]> {
    return this.entriesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.entriesSubject.complete();
    this.loadingSubject$.complete();
  }
}
