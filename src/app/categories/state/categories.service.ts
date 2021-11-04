// TODO add copyright
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID, transaction } from '@datorama/akita';
import { AlertService } from '../../shared/alert/state/alert.service';
import { Category, CategoriesService } from '../../shared/openapi';
// import { AllCategoriesStore } from './all-categories.store';
// import { AllCategoriesQuery } from './all-categories.query';
// import { EntryCategoriesStore } from './entry-categories.service';
// import { EntryCategoriesQuery } from './entry-categories.query';

@Injectable({ providedIn: 'root' })
export class CategoriesStateService {
  constructor(
    // private allCategoriesStore: AllCategoriesStore,
    // private allCategoriesQuery: AllCategoriesQuery,
    // private entryCategoriesStore: EntryCategoriesStore,
    // private entryCategoriesQuery: EntryCategoriesQuery,
    private alertService: AlertService,
    private categoriesService: CategoriesService,
  ) {}

  goToCategorySearch(categoryName: string) {
    window.location.href = '/search?categories.name.keyword=' + categoryName + '&searchMode=files';
  }
}
