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
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { Organization } from '../../shared/swagger';
import { ActivatedRoute } from '../../test';
import { RegisterOrganizationComponent } from '../registerOrganization/register-organization.component';
import { OrganizationQuery } from '../state/organization.query';
import { OrganizationService } from '../state/organization.service';
import { UpdateOrganizationDescriptionComponent } from './update-organization-description/update-organization-description.component';
import { UserQuery } from '../../shared/user/user.query';

@Component({
  selector: 'organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  organization$: Observable<Organization>;
  loading$: Observable<boolean>;
  canEdit$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  isCurator$: Observable<boolean>;
  constructor(private organizationQuery: OrganizationQuery, private organizationService: OrganizationService, private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute, private userQuery: UserQuery
  ) { }

  ngOnInit() {
    const organizationId = this.activatedRoute.snapshot.paramMap.get('id');
    this.loading$ = this.organizationQuery.loading$;
    this.canEdit$ = this.organizationQuery.canEdit$;
    this.organizationService.updateOrganizationFromNameORID(organizationId);
    this.organization$ = this.organizationQuery.organization$;
    this.isAdmin$ = this.userQuery.isAdmin$;
    this.isCurator$ = this.userQuery.isCurator$;
  }

  /**
   * Handles when the edit button is clicked
   *
   * @memberof OrganizationComponent
   */
  editOrganization() {
    const organizationSnapshot: Organization = this.organizationQuery.getSnapshot().organization;
    this.matDialog.open(RegisterOrganizationComponent,
      {
        data: { organization: organizationSnapshot, mode: TagEditorMode.Edit },
        width: '600px'
      });
  }

  updateDescription() {
    const organizationSnapshot: Organization = this.organizationQuery.getSnapshot().organization;
    const description = organizationSnapshot.description;
    this.matDialog.open(UpdateOrganizationDescriptionComponent, {
      data: { description: description }, width: '600px'
    });
  }
}
