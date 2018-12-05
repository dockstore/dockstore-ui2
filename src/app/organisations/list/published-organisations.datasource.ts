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

import { ProviderService } from '../../shared/provider.service';
import { Organisation, OrganisationsService } from '../../shared/swagger';

@Injectable()
export class PublishedOrganisationsDataSource implements DataSource<Organisation> {

  private organisationsSubject$ = new BehaviorSubject<Organisation[]>([]);
  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject$.asObservable();

  constructor(private organisationsService: OrganisationsService) {
  }

  /**
   * Updates the datasource from the endpoint
   * @memberof PublishedOrganisationsDataSource
   */
  loadEntries() {
    this.loadingSubject$.next(true);
    this.organisationsService.getPublishedOrganisations('response').pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject$.next(false))
    )
      .subscribe((organisations: HttpResponse<Array<Organisation>>) => {
        this.organisationsSubject$.next(organisations.body);
        console.log(organisations.body);
      });
  }

  connect(collectionViewer: CollectionViewer): Observable<Organisation[]> {
    return this.organisationsSubject$.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.organisationsSubject$.complete();
  }
}
