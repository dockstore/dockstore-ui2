import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Organisation } from '../../shared/swagger';

export interface OrganizationState {
   organization: Organisation;
   canEdit: boolean;
}

export function createInitialState(): OrganizationState {
  return {
    organization: null,
    canEdit: false
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'organization' })
export class OrganizationStore extends Store<OrganizationState> {

  constructor() {
    super(createInitialState());
  }

}

