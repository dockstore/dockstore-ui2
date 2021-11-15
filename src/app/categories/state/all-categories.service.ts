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
import { Category, CategoriesService } from '../../shared/openapi';
import { AllCategoriesStore } from './all-categories.store';
import { AllCategoriesQuery } from './all-categories.query';

@Injectable({ providedIn: 'root' })
export class AllCategoriesService {
  public toolCategories$: Observable<Array<Category>>;
  public workflowCategories$: Observable<Array<Category>>;

  constructor(
    private allCategoriesStore: AllCategoriesStore,
    private allCategoriesQuery: AllCategoriesQuery,
    private categoriesService: CategoriesService,
  ) {
    /**
     * An observable list of all categories that contain one or more tools, sorted in descending order of the number of tools.
     */
    this.toolCategories$ = this.allCategoriesQuery.selectAll({
      filterBy: c => c.toolsLength > 0,
      sortBy: (a, b) => b.toolsLength - a.toolsLength
    });
    /**
     * An observable list of all categories that contain one or more workflows, sorted in descending order of the number of workflows.
     */
    this.workflowCategories$ = this.allCategoriesQuery.selectAll({
      filterBy: c => c.workflowsLength > 0,
      sortBy: (a, b) => b.workflowsLength - a.workflowsLength
    });
  }

  /**
   * Updates the list of categories.
   */
  updateAllCategories() {
    this.allCategoriesStore.setLoading(true);
    this.allCategoriesStore.setError(false);
    this.categoriesService
      .getCategories()
      .subscribe(
        (categories: Array<Category>) => {
          this.allCategoriesStore.setLoading(false);
          this.allCategoriesStore.setError(false);
          this.allCategoriesStore.set(categories);
        },
        () => {
          this.allCategoriesStore.setLoading(false);
          this.allCategoriesStore.setError(true);
        }
      );
  }
}
