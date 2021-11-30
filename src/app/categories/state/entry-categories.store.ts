import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Category } from '../../shared/openapi';

export interface EntryCategoriesState extends EntityState<Category> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'entry-categories' })
export class EntryCategoriesStore extends EntityStore<EntryCategoriesState, Category> {
  constructor() {
    super();
  }
}
