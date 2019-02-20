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
import { Injectable } from '@angular/core';
import { transaction } from '@datorama/akita';
import { finalize } from 'rxjs/operators';
import { Organization, OrganizationsService } from '../../shared/swagger';
import { OrganizationMembersService } from './organization-members.service';
import { OrganizationStore } from './organization.store';

@Injectable({ providedIn: 'root' })
export class OrganizationService {

  constructor(private organizationStore: OrganizationStore, private organizationsService: OrganizationsService,
    private organizationMembersService: OrganizationMembersService) {
  }

  clearState(): void {
    this.organizationStore.setState(state => {
      return {
        ...state,
        organization: null,
        canEdit: false,
        canEditMembership: false
      };
    });
  }

  @transaction()
  updateOrganizationFromNameORID(organizationIdString: string) {
    this.clearState();
    const organizationID: number = parseInt(organizationIdString, 10);
    if (isNaN(organizationID)) {
      this.updateOrganizationFromName(organizationIdString);
    } else {
      this.updateOrganizationFromID(organizationID);
    }
  }

  updateOrganizationFromID(organizationID: number): void {
    this.organizationStore.setLoading(true);
    this.organizationsService.getOrganizationById(organizationID).pipe(finalize(() => this.organizationStore.setLoading(false)))
      .subscribe((organization: Organization) => {
        this.organizationStore.setError(false);
        this.updateOrganization(organization);
        this.organizationMembersService.updateCanEdit(organizationID);
      }, () => {
        this.organizationStore.setError(true);
      });
  }

  updateOrganization(organization: Organization) {
    this.organizationStore.setState(state => {
      return {
        ...state,
        organization: organization,
      };
    });
  }

  updateOrganizationFromName(name: string): void {
    this.organizationStore.setLoading(true);
    this.organizationsService.getOrganizationByName(name).pipe(finalize(() => this.organizationStore.setLoading(false)))
      .subscribe((organization: Organization) => {
        this.organizationStore.setError(false);
        this.updateOrganization(organization);
        this.organizationMembersService.updateCanEdit(organization.id);
      }, () => {
        this.organizationStore.setError(true);
      });
  }
}
