import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CategorySummary } from '../../shared/openapi';
import { EntryCategoriesState, EntryCategoriesStore } from './entry-categories.store';

@Injectable({
  providedIn: 'root',
})
export class EntryCategoriesQuery extends QueryEntity<EntryCategoriesState, CategorySummary> {
  constructor(protected store: EntryCategoriesStore) {
    super(store);
  }
}
