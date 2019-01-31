import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { OrganisationUser } from '../../shared/swagger';
import { OrganizationMembersState, OrganizationMembersStore } from './organization-members.store';

@Injectable({
  providedIn: 'root'
})
export class OrganizationMembersQuery extends QueryEntity<OrganizationMembersState, OrganisationUser> {
  sortedOrganizationMembers$: Observable<Array<OrganisationUser>> = this.selectAll().pipe(map(organizationMembers => {
    organizationMembers.sort((a, b) => this.sortOrganizationUser(a, b));
    return organizationMembers;
  }));
  constructor(protected store: OrganizationMembersStore) {
    super(store);
  }

  /**
   * Sort OrganisationUser by role, then by id
   *
   * @param {OrganisationUser} a
   * @param {OrganisationUser} b
   * @returns {number}  -1 if a is higher rank, 1 if b is higher rank
   * @memberof OrganizationMembersQuery
   */
  sortOrganizationUser(a: OrganisationUser, b: OrganisationUser): number {
    // If different roles, return the higher ranking role
    if (a.role !== b.role) {
      return a.role === OrganisationUser.RoleEnum.MAINTAINER ? -1 : 1;
      // Otherwise sort by userId
    } else {
      return a.id.userId > b.id.userId ? -1 : 1;
    }
  }
}
