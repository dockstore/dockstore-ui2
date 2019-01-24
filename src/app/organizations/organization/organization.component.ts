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
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Organisation } from '../../shared/swagger';
import { OrganizationQuery } from '../state/organization.query';
import { OrganizationService } from '../state/organization.service';
import { RegisterOrganizationComponent } from '../registerOrganization/register-organization.component';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';

@Component({
  selector: 'organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  organization$: Observable<Organisation>;
  loading$: Observable<boolean>;
  canEdit$: Observable<boolean>;
  constructor(private organizationQuery: OrganizationQuery, private organizationService: OrganizationService, private matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.loading$ = this.organizationQuery.loading$;
    this.canEdit$ = this.organizationQuery.canEdit$;
    this.organizationService.updateOrganizationFromNameORID();
    this.organization$ = this.organizationQuery.organization$;
 }

 /**
  * Handles when the edit button is clicked
  *
  * @memberof OrganizationComponent
  */
 editOrganization() {
   const organizationSnapshot: Organisation = this.organizationQuery.getSnapshot().organization;
  this.matDialog.open(RegisterOrganizationComponent,
    {
      data: {organization: organizationSnapshot, mode: TagEditorMode.Edit},
      width: '600px'
    });
 }
}
