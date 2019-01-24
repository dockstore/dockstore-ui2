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
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { OrganizationStore } from './organization.store';
import { UrlSegment, Router, PRIMARY_OUTLET } from '@angular/router';
import { OrganisationsService, Organisation, OrganisationUser } from '../../shared/swagger';
import { finalize } from 'rxjs/operators';
import { UserQuery } from '../../shared/user/user.query';
import { OrganizationMembersService } from './organization-members.service';
import { transaction } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class OrganizationService {

  constructor(private organizationStore: OrganizationStore, private router: Router,
    private http: HttpClient, private organisationsService: OrganisationsService, private userQuery: UserQuery,
    private organizationMembersService: OrganizationMembersService) {
  }

  getOrganizationNameOrIDFromURL(): string {
    const thing: Array<UrlSegment> = this.router.parseUrl(this.router.url).root.children[PRIMARY_OUTLET].segments;
    const organizationName = thing[thing.length - 1];
    return organizationName.path;
  }

  clearState(): void {
    this.organizationStore.setState(state => {
      return {
        ...state,
        organization: null,
        canEdit: false
      };
    });
  }

  @transaction()
  updateOrganizationFromNameORID() {
    this.clearState();
    const organizationNameOrID = this.getOrganizationNameOrIDFromURL();
    const organizationID = parseInt(organizationNameOrID, 10);
    if (isNaN(organizationID)) {
      this.updateOrganizationFromName(organizationNameOrID);
    } else {
      this.updateOrganizationFromID(organizationID);
    }
  }

  updateOrganizationFromID(id: number): void {
    this.organizationStore.setLoading(true);
    this.organisationsService.getOrganisationById(id).pipe(finalize(() => this.organizationStore.setLoading(false)))
    .subscribe((organization: Organisation) => {
      this.organizationStore.setError(false);
      this.updateOrganization(organization);
      this.updateCanEdit(organization);
    }, () => {
      this.organizationStore.setError(true);
    });
  }

  updateOrganization(organization: Organisation) {
    this.organizationStore.setState(state => {
      return {
        ...state,
        organization: organization,
      };
    });
  }

  updateOrganizationFromName(name: string): void {
    this.organizationStore.setLoading(true);
    this.organisationsService.getOrganisationByName(name).pipe(finalize(() => this.organizationStore.setLoading(false)))
    .subscribe((organization: Organisation) => {
      this.organizationStore.setError(false);
      this.updateOrganization(organization);
      this.updateCanEdit(organization);
    }, () => {
      this.organizationStore.setError(true);
    });
  }

  /**
   * Figures out whether the user can edit the organization info
   *
   * @param {Organisation} organization  The current organization being viewed
   * @returns {boolean}                  Whether the user belongs to this organization and can edit
   * @memberof OrganizationService
   */
  updateCanEdit(organization: Organisation) {
    this.organisationsService.getOrganisationMembers(organization.id).subscribe((organizationUsers: OrganisationUser[]) => {
      const currentUserId = this.userQuery.getSnapshot().user.id;
      const canEdit = organizationUsers.some(user => user.id.userId === currentUserId);
      this.setCanEditState(canEdit);
      this.organizationMembersService.updateAll(organizationUsers);
    });
  }

  setCanEditState(canEdit: boolean) {
    this.organizationStore.setState(state => {
      return {
        ...state,
        canEdit: canEdit
      };
    });
  }
}
