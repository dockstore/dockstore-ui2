import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface OrganizationState {
   key: string;
}

export function createInitialState(): OrganizationState {
  return {
    key: ''
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'organization' })
export class OrganizationStore extends Store<OrganizationState> {

  constructor() {
    super(createInitialState());
  }

}

