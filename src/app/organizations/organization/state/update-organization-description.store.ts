import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface UpdateOrganizationOrCollectionDescriptionState {
  key: string;
}

export function createInitialState(): UpdateOrganizationOrCollectionDescriptionState {
  return {
    key: ''
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'update-organization-description' })
export class UpdateOrganizationOrCollectionDescriptionStore extends Store<UpdateOrganizationOrCollectionDescriptionState> {
  constructor() {
    super(createInitialState());
  }
}
