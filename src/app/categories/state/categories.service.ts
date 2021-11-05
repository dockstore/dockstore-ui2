// TODO add copyright
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, CategoriesService } from '../../shared/openapi';
import { AllCategoriesStore } from './all-categories.store';
import { AllCategoriesQuery } from './all-categories.query';
// import { EntryCategoriesStore } from './entry-categories.service';
// import { EntryCategoriesQuery } from './entry-categories.query';

@Injectable({ providedIn: 'root' })
export class CategoriesStateService {
  constructor(
    private allCategoriesStore: AllCategoriesStore,
    private allCategoriesQuery: AllCategoriesQuery,
    // private entryCategoriesStore: EntryCategoriesStore,
    // private entryCategoriesQuery: EntryCategoriesQuery,
    private categoriesService: CategoriesService,
  ) {}

  goToCategorySearch(categoryName: string) {
    window.location.href = '/search?categories.name.keyword=' + categoryName + '&searchMode=files';
  }

  updateAllCategories() {
    this.allCategoriesStore.setLoading(true);
    this.allCategoriesStore.setError(false);
    this.allCategoriesStore.set([]);
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

  observeAllCategories(): Observable<Array<Category>> {
    return this.allCategoriesQuery.selectAll();
  }

  observePopularToolCategories(): Observable<Array<Category>>{
    // TODO sort akita
    return this.allCategoriesQuery.selectAll();
  }

  observePopularWorkflowCategories(): Observable<Array<Category>>{
    // TODO sort akita
    return this.allCategoriesQuery.selectAll();
  }
}
