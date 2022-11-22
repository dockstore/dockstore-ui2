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
import { ID } from '@datorama/akita';
import { ConfirmationDialogService } from 'app/confirmation-dialog/confirmation-dialog.service';
import { Base } from 'app/shared/base';
import { bootstrap4mediumModalSize } from 'app/shared/constants';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { OrganizationUser } from '../../shared/swagger';
import { UserQuery } from '../../shared/user/user.query';
import { OrganizationMembersQuery } from '../state/organization-members.query';
import { OrganizationMembersService } from '../state/organization-members.service';
import { OrganizationQuery } from '../state/organization.query';
import { UpsertOrganizationMemberComponent } from '../upsert-organization-member/upsert-organization-member.component';

@Component({
  selector: 'app-organization-members',
  templateUrl: './organization-members.component.html',
  styleUrls: ['./organization-members.component.scss'],
})
export class OrganizationMembersComponent extends Base implements OnInit {
  OrganizationUser = OrganizationUser;
  organizationMembers$: Observable<OrganizationUser[]>;
  loading$: Observable<boolean>;
  canEdit$: Observable<boolean>;
  canEditMembership$: Observable<boolean>;
  userId$: Observable<number>;
  constructor(
    private confirmationDialogService: ConfirmationDialogService,
    private organizationMembersQuery: OrganizationMembersQuery,
    private organizationQuery: OrganizationQuery,
    private organizationMembersService: OrganizationMembersService,
    private matDialog: MatDialog,
    private userQuery: UserQuery,
    private alertService: AlertService
  ) {
    super();
  }

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
    const editUserDialogData = {
      mode: TagEditorMode.Edit,
      username: organizationUser.user.username,
      role: organizationUser.role,
      title: 'Edit Member',
      descriptionPrefix: "Edit the member's role in your organization.",
      confirmationButtonText: 'Edit Member',
    };
    const resendInviteDialogData = {
      mode: TagEditorMode.Edit,
      username: organizationUser.user.username,
      role: organizationUser.role,
      title: 'Resend Invitation',
      descriptionPrefix: `Resend an invitation to the user <strong>${organizationUser.user.username}</strong> 
          who rejected the invitation to the organization <strong>${organizationUser.organization.displayName}</strong>. You may optionally edit the role.`,
      confirmationButtonText: 'Resend Invitation',
    };

    this.alertService.clearEverything();
    this.matDialog.open(UpsertOrganizationMemberComponent, {
      data: organizationUser.status === 'REJECTED' ? resendInviteDialogData : editUserDialogData,
      width: bootstrap4mediumModalSize,
    });
  }

  /**
   * Opens the dialog for adding a user to an organization
   *
   * @memberof OrganizationMembersComponent
   */
  addUser() {
    this.alertService.clearEverything();
    this.matDialog.open(UpsertOrganizationMemberComponent, {
      data: {
        mode: TagEditorMode.Add,
        username: null,
        role: null,
        title: 'Invite a Member',
        descriptionPrefix: 'When you send this invite, the user will receive a request to join your organization.',
        confirmationButtonText: 'Send Invite',
      },
      width: bootstrap4mediumModalSize,
    });
  }

  /**
   * Handles removing a user from an organization
   *
   * @param {OrganizationUser} organizationUser
   * @memberof OrganizationMembersComponent
   */
  removeUserDialog(organizationUser: OrganizationUser) {
    const removeMemberDialogData = {
      title: 'Remove Member from Organization',
      message: `Are you sure you want to <strong>remove</strong> the member <strong>${organizationUser.user.username}</strong>
        from the organization <strong>${organizationUser.organization.displayName}</strong>?`,
      cancelButtonText: 'Cancel',
      confirmationButtonText: 'Remove Member',
    };
    const deleteInvitationDialogData = {
      title: 'Delete Invitation',
      message: `The member has a <strong>${organizationUser.status.toLowerCase()}</strong> invitation to the organization <strong>${
        organizationUser.organization.displayName
      }</strong>. 
        Are you sure you want to <strong>delete</strong> the invitation to the member <strong>${organizationUser.user.username}</strong>?`,
      cancelButtonText: 'Cancel',
      confirmationButtonText: 'Delete Invitation',
    };
    this.confirmationDialogService
      .openDialog(organizationUser.status === 'ACCEPTED' ? removeMemberDialogData : deleteInvitationDialogData, bootstrap4mediumModalSize)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        if (result) {
          this.organizationMembersService.removeUser(organizationUser);
        }
      });
  }
}
