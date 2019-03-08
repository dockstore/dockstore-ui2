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
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ID } from '@datorama/akita';
import { Observable } from 'rxjs';

import { AlertService } from '../../shared/alert/state/alert.service';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { OrganizationUser } from '../../shared/swagger';
import { UserQuery } from '../../shared/user/user.query';
import { OrganizationMembersQuery } from '../state/organization-members.query';
import { OrganizationMembersService } from '../state/organization-members.service';
import { OrganizationQuery } from '../state/organization.query';
import { UpsertOrganizationMemberComponent } from '../upsert-organization-member/upsert-organization-member.component';

@Component({
  selector: 'organization-member-remove-dialog',
  templateUrl: 'delete-username-confirm-dialog.html',
})
export class OrganizationMemberRemoveConfirmDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}

export interface DialogData {
  role: OrganizationUser;
}

@Component({
  selector: 'organization-members',
  templateUrl: './organization-members.component.html',
  styleUrls: ['./organization-members.component.scss']
})
export class OrganizationMembersComponent implements OnInit {
  organizationMembers$: Observable<OrganizationUser[]>;
  loading$: Observable<boolean>;
  canEdit$: Observable<boolean>;
  canEditMembership$: Observable<boolean>;
  userId$: Observable<number>;
  constructor(private organizationMembersQuery: OrganizationMembersQuery, private organizationQuery: OrganizationQuery,
    private organizationMembersService: OrganizationMembersService, private matDialog: MatDialog, private userQuery: UserQuery,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.userId$ = this.userQuery.userId$;
    this.canEdit$ = this.organizationQuery.canEdit$;
    this.canEditMembership$ = this.organizationQuery.canEditMembership$;
    this.organizationMembers$ = this.organizationMembersQuery.sortedOrganizationMembers$;
    this.loading$ = this.organizationMembersQuery.selectLoading();
  }

  add(organizationMember: OrganizationUser) {
    this.organizationMembersService.add(organizationMember);
  }

  update(id: ID, organizationMember: Partial<OrganizationUser>) {
    this.organizationMembersService.update(id, organizationMember);
  }

  remove(id: ID) {
    this.organizationMembersService.remove(id);
  }

  /**
   * Opens the dialog for editing a user of an organization
   *
   * @param {OrganizationUser} organizationUser  The organization user to edit
   * @memberof OrganizationMembersComponent
   */
  editUser(organizationUser: OrganizationUser) {
    this.alertService.clearEverything();
    this.matDialog.open(UpsertOrganizationMemberComponent,
      { data: { mode: TagEditorMode.Edit, username: organizationUser.user.username, role: organizationUser.role }, width: '600px' });
  }

  /**
   * Opens the dialog for adding a user to an organization
   *
   * @memberof OrganizationMembersComponent
   */
  addUser() {
    this.alertService.clearEverything();
    this.matDialog.open(UpsertOrganizationMemberComponent,
      { data: { mode: TagEditorMode.Add, username: null, role: null }, width: '600px' });
  }

  /**
   * Handles removing a user from an organization
   *
   * @param {OrganizationUser} organizationUser
   * @memberof OrganizationMembersComponent
   */
  removeUserDialog(organizationUser: OrganizationUser) {
    const dialogRef = this.matDialog.open(OrganizationMemberRemoveConfirmDialogComponent,
      { data: { role: organizationUser }, width: '600px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.organizationMembersService.removeUser(result.role);
      }
    });
  }
}
