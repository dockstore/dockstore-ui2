import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgFormsManager } from '@ngneat/forms-manager';
import { finalize } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { OrganizationsService, OrganizationUser } from '../../shared/swagger';
import { OrganizationMembersService } from './organization-members.service';
import { OrganizationQuery } from './organization.query';
import { UpsertOrganizationMemberStore } from './upsert-organization-member.store';

// This is recorded into the Akita state
export interface FormsState {
  upsertUser: {
    username: string;
    role: string;
  };
}

@Injectable({ providedIn: 'root' })
export class UpsertOrganizationMemberService {
  constructor(
    private upsertOrganizationMemberStore: UpsertOrganizationMemberStore,
    private organizationMembersService: OrganizationMembersService,
    private formBuilder: UntypedFormBuilder,
    private organizationsService: OrganizationsService,
    private organizationQuery: OrganizationQuery,
    private matDialog: MatDialog,
    private alertService: AlertService
  ) {}

  /**
   * Creates the organization (create and update) form based on the mode given
   *
   * @param {NgFormsManager<FormsState>} formsManager
   * @param {*} data
   * @returns {FormGroup}
   * @memberof UpsertOrganizationMemberService
   */
  createForm(formsManager: NgFormsManager<FormsState>, data: any): UntypedFormGroup {
    formsManager.clear('upsertUser');
    let username = null;
    let role = OrganizationUser.RoleEnum.MEMBER;
    let disabled = false;
    if (data.mode !== TagEditorMode.Add) {
      username = data.username;
      role = data.role;
      disabled = true;
    }
    const form = this.formBuilder.group({
      username: new UntypedFormControl({ value: username, disabled: disabled }, [
        Validators.required,
        Validators.maxLength(39),
        Validators.minLength(3),
      ]),
      role: [role, []],
    });
    formsManager.upsert('upsertUser', form);
    return form;
  }

  /**
   * Get the description
   *
   * @returns {string}
   * @memberof UpsertOrganizationMemberService
   */
  getDescription(prefix: string): string {
    const rolePermissions = ` Role permissions include:<br>
      <strong>Admin:</strong> can update the organization, collections, and memberships.<br>
      <strong>Maintainer:</strong> can update the organization and collections.<br>
      <strong>Member:</strong> no editing permissions. Joins to show support for the organization.`;
    return prefix + rolePermissions;
  }

  /**
   * Add not yet approved organization to Dockstore
   *
   * @param {FormsState['organization']} formState  The organization form state
   * @memberof RegisterOrganizationService
   */
  upsertUser(formState: FormsState['upsertUser'], data: any): void {
    if (!formState) {
      console.error('Something has gone terribly wrong with the form manager');
      return;
    } else {
      this.upsertOrganizationMemberStore.setLoading(true);
      this.upsertOrganizationMemberStore.setError(false);
      this.alertService.start('Inviting/updating member');
      const organizationId = this.organizationQuery.getValue().organization.id;
      // Have to grab the username from data because a disabled form value isn't recorded
      const username = formState.username ? formState.username : data.username;
      this.organizationsService
        .addUserToOrgByUsername(username, organizationId, formState.role)
        .pipe(finalize(() => this.upsertOrganizationMemberStore.setLoading(false)))
        .subscribe(
          (organization: OrganizationUser) => {
            this.matDialog.closeAll();
            this.organizationMembersService.updateCanModify(organizationId);
            this.upsertOrganizationMemberStore.setError(false);
            this.alertService.simpleSuccess();
          },
          (error: HttpErrorResponse) => {
            this.alertService.detailedError(error);
            this.upsertOrganizationMemberStore.setError(true);
          }
        );
    }
  }
}
