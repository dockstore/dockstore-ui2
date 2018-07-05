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

import { ImageProviderService } from '../../shared/image-provider.service';
import { ExtendedDockstoreTool } from '../../shared/models/ExtendedDockstoreTool';
import { ProviderService } from '../../shared/provider.service';
import { ContainersService, DockstoreTool } from '../../shared/swagger';

@Injectable()
export class PublishedToolsDataSource implements DataSource<ExtendedDockstoreTool> {

  private entriesSubject = new BehaviorSubject<ExtendedDockstoreTool[]>([]);
  private entriesSubject$ = new BehaviorSubject<boolean>(false);
  public entriesLengthSubject$ = new BehaviorSubject<number>(0);
  public loading$ = this.entriesSubject$.asObservable();

  constructor(private containersService: ContainersService, private providersService: ProviderService,
    private imageProviderService: ImageProviderService) {
  }

  // Updates the datasource from the endpoint
  loadEntries(filter: string,
    sortDirection: string,
    pageIndex: number,
    pageSize: number,
    sortCol: string) {
    this.entriesSubject$.next(true);
    this.containersService.allPublishedContainers(pageIndex.toString(), pageSize, filter, sortCol, sortDirection, 'response').pipe(
      catchError(() => of([])),
      finalize(() => this.entriesSubject$.next(false))
    )
      .subscribe((entries: HttpResponse<Array<DockstoreTool>>) => {
        this.entriesSubject.next(entries.body.map(tool => {
          tool = this.imageProviderService.setUpImageProvider(tool);
          return <ExtendedDockstoreTool>this.providersService.setUpProvider(tool);
        }));
        this.entriesLengthSubject$.next(Number(entries.headers.get('X-total-count')));
      });

  }

  connect(collectionViewer: CollectionViewer): Observable<DockstoreTool[]> {
    return this.entriesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.entriesSubject.complete();
    this.entriesSubject$.complete();
  }
}
