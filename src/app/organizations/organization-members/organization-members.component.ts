/*
 *    Copyright 2019 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Component, OnInit } from '@angular/core';
import { ID } from '@datorama/akita';
import { Observable } from 'rxjs';

import { OrganisationUser } from '../../shared/swagger';
import { OrganizationMembersQuery } from '../state/organization-members.query';
import { OrganizationMembersService } from '../state/organization-members.service';
import { OrganizationQuery } from '../state/organization.query';

@Component({
  selector: 'organization-members',
  templateUrl: './organization-members.component.html',
  styleUrls: ['./organization-members.component.scss']
})
export class OrganizationMembersComponent implements OnInit {
  organizationMembers$: Observable<OrganisationUser[]>;
  loading$: Observable<boolean>;
  canEdit$: Observable<boolean>;

  constructor(private organizationMembersQuery: OrganizationMembersQuery, private organizationQuery: OrganizationQuery,
              private organizationMembersService: OrganizationMembersService
  ) { }

  ngOnInit() {
    this.canEdit$ = this.organizationQuery.canEdit$;
      this.organizationMembers$ = this.organizationMembersQuery.selectAll();
      this.loading$ = this.organizationMembersQuery.selectLoading();
    }

    add(organizationMember: OrganisationUser) {
      this.organizationMembersService.add(organizationMember);
    }

    update(id: ID, organizationMember: Partial<OrganisationUser>) {
      this.organizationMembersService.update(id, organizationMember);
    }

    remove(id: ID) {
      this.organizationMembersService.remove(id);
    }

    editUser(organizationUser: OrganisationUser) {
      this.organizationMembersService.editUser(organizationUser);
    }

    removeUser(organizationUser: OrganisationUser) {
      this.organizationMembersService.removeUser(organizationUser);
    }
}
