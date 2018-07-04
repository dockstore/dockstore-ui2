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

import { ImageProviderService } from '../../shared/image-provider.service';
import { ExtendedDockstoreTool } from '../../shared/models/ExtendedDockstoreTool';
import { ProviderService } from '../../shared/provider.service';
import { ContainersService, DockstoreTool } from '../../shared/swagger';

@Injectable()
export class PublishedToolsDataSource implements DataSource<ExtendedDockstoreTool> {

  private lessonsSubject = new BehaviorSubject<ExtendedDockstoreTool[]>([]);
  private entriesSubject$ = new BehaviorSubject<boolean>(false);
  public entriesLengthSubject$ = new BehaviorSubject<number>(0);
  public loading$ = this.entriesSubject$.asObservable();

  constructor(private containersService: ContainersService, private providersService: ProviderService,
    private imageProviderService: ImageProviderService) {
  }

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
      .subscribe((lessons: HttpResponse<Array<DockstoreTool>>) => {
        this.lessonsSubject.next(lessons.body.map(tool => {
          tool = this.imageProviderService.setUpImageProvider(tool);
          return <ExtendedDockstoreTool>this.providersService.setUpProvider(tool);
        }));
        this.entriesLengthSubject$.next(Number(lessons.headers.get('X-total-count')));
      });

  }

  connect(collectionViewer: CollectionViewer): Observable<DockstoreTool[]> {
    return this.lessonsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.lessonsSubject.complete();
    this.entriesSubject$.complete();
  }
}
