import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Category } from '../../shared/openapi';

export interface AllCategoriesState extends EntityState<Category> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'all-categories' })
export class AllCategoriesStore extends EntityStore<AllCategoriesState, Category> {
  constructor() {
    super();
  }
}
