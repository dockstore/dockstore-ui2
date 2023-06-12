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
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { OrgLogoService } from '../../shared/org-logo.service';
import { OrganizationSchema, OrgSchemaService } from '../../shared/org-schema.service';
import { Organization } from '../../shared/swagger';
import { UserQuery } from '../../shared/user/user.query';
import { ActivatedRoute } from '../../test';
import { RegisterOrganizationComponent } from '../registerOrganization/register-organization.component';

import { CollectionsQuery } from '../state/collections.query';
import { EventsQuery } from '../state/events.query';
import { OrganizationMembersQuery } from '../state/organization-members.query';
import { OrganizationQuery } from '../state/organization.query';
import { OrganizationService } from '../state/organization.service';
// eslint-disable-next-line max-len
import { UpdateOrganizationOrCollectionDescriptionComponent } from './update-organization-description/update-organization-description.component';
import { Dockstore } from '../../shared/dockstore.model';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent implements OnInit {
  public organizationStarGazersClicked = false;
  collectionsLength$: Observable<number>;

  organization$: Observable<Organization>;
  loading$: Observable<boolean>;
  canEdit$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  isCurator$: Observable<boolean>;
  public schema$: Observable<OrganizationSchema>;
  approved = Organization.StatusEnum.APPROVED;

  constructor(
    private organizationQuery: OrganizationQuery,
    private organizationService: OrganizationService,
    private orgschemaService: OrgSchemaService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private userQuery: UserQuery,
    public organizationMembersQuery: OrganizationMembersQuery,
    public collectionsQuery: CollectionsQuery,
    public eventsQuery: EventsQuery,
    public orgLogoService: OrgLogoService
  ) {}

  ngOnInit() {
    const organizationName = this.activatedRoute.snapshot.paramMap.get('organizationName');
    this.loading$ = this.organizationQuery.loading$;
    this.canEdit$ = this.organizationQuery.canEdit$;
    this.organizationService.updateOrganizationFromName(organizationName);
    this.organization$ = this.organizationQuery.organization$;
    this.isAdmin$ = this.userQuery.isAdmin$;
    this.isCurator$ = this.userQuery.isCurator$;
    this.schema$ = this.organization$.pipe(map((organization) => this.orgschemaService.getSchema(organization)));
    this.collectionsLength$ = this.collectionsQuery.collections$.pipe(map((collections) => Object.keys(collections).length));
  }

  /**
   * Handles when the edit button is clicked
   *
   * @memberof OrganizationComponent
   */
  editOrganization() {
    const organizationSnapshot: Organization = this.organizationQuery.getValue().organization;
    this.matDialog.open(RegisterOrganizationComponent, {
      data: { organization: organizationSnapshot, mode: TagEditorMode.Edit },
      width: '600px',
    });
  }

  updateDescription() {
    const organizationSnapshot: Organization = this.organizationQuery.getValue().organization;
    const description = organizationSnapshot.description;
    this.matDialog.open(UpdateOrganizationOrCollectionDescriptionComponent, {
      data: { description: description, type: 'organization' },
      width: '600px',
    });
  }

  organizationStarGazersChange(): void {
    this.organizationStarGazersClicked = !this.organizationStarGazersClicked;
  }

  protected readonly Dockstore = Dockstore;
}
