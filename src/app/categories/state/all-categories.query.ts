import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { Category } from '../../shared/openapi';
import { AllCategoriesState, AllCategoriesStore } from './all-categories.store';

@Injectable({
  providedIn: 'root',
})
export class AllCategoriesQuery extends QueryEntity<AllCategoriesState, Category> {
  loading$: Observable<boolean> = this.selectLoading();

  constructor(protected store: AllCategoriesStore) {
    super(store);
  }
}
