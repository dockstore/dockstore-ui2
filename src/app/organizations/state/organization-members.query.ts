import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { OrganisationUser } from '../../shared/swagger';
import { OrganizationMembersState, OrganizationMembersStore } from './organization-members.store';

@Injectable({
  providedIn: 'root'
})
export class OrganizationMembersQuery extends QueryEntity<OrganizationMembersState, OrganisationUser> {

  constructor(protected store: OrganizationMembersStore) {
    super(store);
  }

}
