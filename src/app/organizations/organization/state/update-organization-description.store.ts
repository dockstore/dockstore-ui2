import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface UpdateOrganizationDescriptionState {
   key: string;
}

export function createInitialState(): UpdateOrganizationDescriptionState {
  return {
    key: ''
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'update-organization-description' })
export class UpdateOrganizationDescriptionStore extends Store<UpdateOrganizationDescriptionState> {

  constructor() {
    super(createInitialState());
  }

}

