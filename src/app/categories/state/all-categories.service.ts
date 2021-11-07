// TODO add copyright
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, CategoriesService } from '../../shared/openapi';
import { AllCategoriesStore } from './all-categories.store';
import { AllCategoriesQuery } from './all-categories.query';

@Injectable({ providedIn: 'root' })
export class AllCategoriesService {
  public loading$: Observable<boolean>;
  public categories$: Observable<Array<Category>>;
  public toolCategories$: Observable<Array<Category>>;
  public workflowCategories$: Observable<Array<Category>>;

  constructor(
    private allCategoriesStore: AllCategoriesStore,
    private allCategoriesQuery: AllCategoriesQuery,
    private categoriesService: CategoriesService,
  ) {
    this.loading$ = this.allCategoriesQuery.selectLoading();
    this.categories$ = this.allCategoriesQuery.selectAll();
    this.toolCategories$ = this.allCategoriesQuery.selectAll({
      filterBy: c => c.toolsLength > 0,
      sortBy: (a, b) => b.toolsLength - a.toolsLength
    });
    this.workflowCategories$ = this.allCategoriesQuery.selectAll({
      filterBy: c => c.workflowsLength > 0,
      sortBy: (a, b) => b.workflowsLength - a.workflowsLength
    });
  }

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
