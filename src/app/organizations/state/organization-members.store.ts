import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { OrganisationUser } from '../../shared/swagger';

export interface OrganizationMembersState extends EntityState<OrganisationUser> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'organization-members' })
export class OrganizationMembersStore extends EntityStore<OrganizationMembersState, OrganisationUser> {

  constructor() {
    super();
  }

}

