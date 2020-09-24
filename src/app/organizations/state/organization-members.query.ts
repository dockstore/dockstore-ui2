import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { OrganizationUser } from '../../shared/swagger';
import { OrganizationMembersState, OrganizationMembersStore } from './organization-members.store';

@Injectable({
  providedIn: 'root',
})
export class OrganizationMembersQuery extends QueryEntity<OrganizationMembersState, OrganizationUser> {
  sortedOrganizationMembers$: Observable<Array<OrganizationUser>> = this.selectAll().pipe(
    map((organizationMembers) => {
      organizationMembers.sort((a, b) => this.sortOrganizationUser(a, b));
      return organizationMembers;
    })
  );
  constructor(protected store: OrganizationMembersStore) {
    super(store);
  }

  /**
   * Sort OrganizationUser by role, then by id
   *
   * @param {OrganizationUser} a
   * @param {OrganizationUser} b
   * @returns {number}  -1 if a is higher rank, 1 if b is higher rank
   * @memberof OrganizationMembersQuery
   */
  sortOrganizationUser(a: OrganizationUser, b: OrganizationUser): number {
    // If different roles, return the higher ranking role
    if (a.role !== b.role) {
      return a.role === OrganizationUser.RoleEnum.MAINTAINER ? -1 : 1;
      // Otherwise sort by userId
    } else {
      return a.id.userId > b.id.userId ? -1 : 1;
    }
  }
}
