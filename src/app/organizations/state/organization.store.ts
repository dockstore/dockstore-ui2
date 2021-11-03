import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Organization } from '../../shared/swagger';

export interface OrganizationState {
  organization: Organization;
  canEdit: boolean;
  canEditMembership: boolean;
  canDeleteCollection: boolean;
}

export function createInitialState(): OrganizationState {
  return {
    organization: null,
    canEdit: false,
    canEditMembership: false,
    canDeleteCollection: false,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'organization' })
export class OrganizationStore extends Store<OrganizationState> {
  constructor() {
    super(createInitialState());
  }
}
