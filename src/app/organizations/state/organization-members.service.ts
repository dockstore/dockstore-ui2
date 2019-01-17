import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';

import { OrganisationUser } from '../../shared/swagger';
import { OrganizationMembersStore } from './organization-members.store';

@Injectable({ providedIn: 'root' })
export class OrganizationMembersService {

  constructor(private organizationMembersStore: OrganizationMembersStore,
              private http: HttpClient) {
  }

  updateAll(organizationUsers: OrganisationUser[]) {
    this.organizationMembersStore.remove();
    this.organizationMembersStore.add(organizationUsers);
  }

  add(organizationMember: OrganisationUser) {
    this.organizationMembersStore.add(organizationMember);
  }

  update(id, organizationMember: Partial<OrganisationUser>) {
    this.organizationMembersStore.update(id, organizationMember);
  }

  remove(id: ID) {
    this.organizationMembersStore.remove(id);
  }
}
