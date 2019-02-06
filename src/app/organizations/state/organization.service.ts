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
import { PRIMARY_OUTLET, Router, UrlSegment } from '@angular/router';
import { transaction } from '@datorama/akita';
import { finalize } from 'rxjs/operators';

import { Organisation, OrganisationsService } from '../../shared/swagger';
import { OrganizationMembersService } from './organization-members.service';
import { OrganizationStore } from './organization.store';

@Injectable({ providedIn: 'root' })
export class OrganizationService {

  constructor(private organizationStore: OrganizationStore, private router: Router, private organisationsService: OrganisationsService,
    private organizationMembersService: OrganizationMembersService) {
  }

  getNextSegmentPath(previousSegmentPath: string): string {
    const urlSegments: Array<UrlSegment> = this.router.parseUrl(this.router.url).root.children[PRIMARY_OUTLET].segments;
    const segmentIndex = urlSegments.findIndex((urlSegment: UrlSegment) => {
      return urlSegment.path === previousSegmentPath;
    });
    const segment = urlSegments[segmentIndex + 1];
    if (!segment) {
      return undefined;
    }
    return segment.path;
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
  updateOrganizationFromNameORID() {
    this.clearState();
    const organizationNameOrID = this.getNextSegmentPath('organizations');
    const organizationID = parseInt(organizationNameOrID, 10);
    if (isNaN(organizationID)) {
      this.updateOrganizationFromName(organizationNameOrID);
    } else {
      this.updateOrganizationFromID(organizationID);
    }
  }

  updateOrganizationFromID(organizationID: number): void {
    this.organizationStore.setLoading(true);
    this.organisationsService.getOrganisationById(organizationID).pipe(finalize(() => this.organizationStore.setLoading(false)))
      .subscribe((organization: Organisation) => {
        this.organizationStore.setError(false);
        this.updateOrganization(organization);
        this.organizationMembersService.updateCanEdit(organizationID);
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
        this.organizationMembersService.updateCanEdit(organization.id);
      }, () => {
        this.organizationStore.setError(true);
      });
  }
}
