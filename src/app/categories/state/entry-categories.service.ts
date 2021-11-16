/*
 * Copyright 2021 OICR and UCSC
 *
 * Licensed under the Apache License, Version 2.0 (the &quot;License&quot;);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an &quot;AS IS&quot; BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, EntriesService } from '../../shared/openapi';
import { EntryCategoriesStore } from './entry-categories.store';
import { EntryCategoriesQuery } from './entry-categories.query';

@Injectable({ providedIn: 'root' })
export class EntryCategoriesService {
  public categories$: Observable<Array<Category>>;

  constructor(
    private entryCategoriesStore: EntryCategoriesStore,
    private entryCategoriesQuery: EntryCategoriesQuery,
    private entriesService: EntriesService,
  ) {
    /**
     * An observable list of the categories for a given entry.
     */
    this.categories$ = this.entryCategoriesQuery.selectAll();
  }

  /**
   * Updates the list of categories for the specified entry.
   */
  updateEntryCategories(id: number) {
    this.entryCategoriesStore.setLoading(true);
    this.entryCategoriesStore.setError(false);
    this.entryCategoriesStore.set([]);
    this.entriesService
      .entryCategories(id)
      .subscribe(
        (categories: Array<Category>) => {
          this.entryCategoriesStore.setLoading(false);
          this.entryCategoriesStore.setError(false);
          this.entryCategoriesStore.set(categories);
        },
        () => {
          this.entryCategoriesStore.setLoading(false);
          this.entryCategoriesStore.setError(true);
        }
      );
  }
}
