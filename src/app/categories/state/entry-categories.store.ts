import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { CategorySummary } from '../../shared/openapi';

export interface EntryCategoriesState extends EntityState<CategorySummary> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'entry-categories' })
export class EntryCategoriesStore extends EntityStore<EntryCategoriesState, CategorySummary> {
  constructor() {
    super();
  }
}
