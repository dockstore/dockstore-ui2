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
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { OrganizationSchema, OrgSchemaService } from '../../shared/org-schema.service';
import { Organization } from '../../shared/swagger';
import { UserQuery } from '../../shared/user/user.query';
import { ActivatedRoute } from '../../test';
import { RegisterOrganizationComponent } from '../registerOrganization/register-organization.component';
import { OrganizationQuery } from '../state/organization.query';
import { OrganizationService } from '../state/organization.service';
// tslint:disable-next-line: max-line-length
import { UpdateOrganizationOrCollectionDescriptionComponent } from './update-organization-description/update-organization-description.component';

@Component({
  selector: 'organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent implements OnInit {
  public organizationStarGazersClicked = false;
  @Input() indexNum: number;
  eventsLength: number;
  membersLength: number;
  collectionsLength: number;

  organization$: Observable<Organization>;
  loading$: Observable<boolean>;
  canEdit$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  isCurator$: Observable<boolean>;
  gravatarUrl$: Observable<string>;
  public schema$: Observable<OrganizationSchema>;
  approved = Organization.StatusEnum.APPROVED;

  constructor(
    private organizationQuery: OrganizationQuery,
    private organizationService: OrganizationService,
    private orgschemaService: OrgSchemaService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private userQuery: UserQuery
  ) {}

  ngOnInit() {
    const organizationName = this.activatedRoute.snapshot.paramMap.get('organizationName');
    this.loading$ = this.organizationQuery.loading$;
    this.canEdit$ = this.organizationQuery.canEdit$;
    this.organizationService.updateOrganizationFromName(organizationName);
    this.organization$ = this.organizationQuery.organization$;
    this.gravatarUrl$ = this.organizationQuery.gravatarUrl$;
    this.isAdmin$ = this.userQuery.isAdmin$;
    this.isCurator$ = this.userQuery.isCurator$;
    this.schema$ = this.organization$.pipe(map((organization) => this.orgschemaService.getSchema(organization)));
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

  public getEvents(num: number) {
    this.eventsLength = num;
  }

  public getMembers(num: number) {
    this.membersLength = num;
  }

  public getCollections(num: number) {
    this.collectionsLength = num;
  }
}
