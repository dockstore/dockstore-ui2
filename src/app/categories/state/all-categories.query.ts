import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Category } from '../../shared/openapi';
import { AllCategoriesState, AllCategoriesStore } from './all-categories.store';

@Injectable({
  providedIn: 'root',
})
export class AllCategoriesQuery extends QueryEntity<AllCategoriesState, Category> {
  constructor(protected store: AllCategoriesStore) {
    super(store);
  }
}
