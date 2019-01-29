import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/state/alert.service';
import { OrganisationsService, OrganisationUser } from '../../shared/swagger';
import { UserQuery } from '../../shared/user/user.query';
import { OrganizationMembersStore } from './organization-members.store';
import { OrganizationQuery } from './organization.query';
import { OrganizationStore } from './organization.store';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OrganizationMembersService {

  constructor(private organizationMembersStore: OrganizationMembersStore, private organizationQuery: OrganizationQuery,
    private organisationsService: OrganisationsService, private userQuery: UserQuery, private organizationStore: OrganizationStore,
    private alertService: AlertService, private matSnackBar: MatSnackBar) {
  }

  /**
   * Update the Akita store with the latest array of organization users
   *
   * @param {OrganisationUser[]} organizationUsers  The latest array of organization users
   * @memberof OrganizationMembersService
   */
  updateAll(organizationUsers: OrganisationUser[]) {
    // Can't use set because Akita isn't able to figure out the entity id
    this.organizationMembersStore.remove();
    organizationUsers.forEach(organizationUser => {
      this.organizationMembersStore.createOrReplace(organizationUser.id.userId, organizationUser);
    });
  }

  add(organizationMember: OrganisationUser) {
    this.organizationMembersStore.add(organizationMember);
  }

  update(id, organizationMember: Partial<OrganisationUser>) {
    this.organizationMembersStore.update(id, organizationMember);
  }

  remove(id: ID) {
    this.organizationMembersStore.remove(id);
  }

  /**
   * Remove a user from an organization in Dockstore
   * Uses the alertService but setting the state loading/error too just in case it's used in the future
   * @param {OrganisationUser} organizationUser  The organization user to remove from the organization
   * @memberof OrganizationMembersService
   */
  removeUser(organizationUser: OrganisationUser) {
    this.alertService.start('Removing user');
    const organizationID: number = this.organizationQuery.getSnapshot().organization.id;
    this.organizationMembersStore.setError(false);
    this.organizationMembersStore.setLoading(true);
    this.organisationsService.deleteUserRole(organizationUser.user.id, organizationID)
      .pipe(finalize(() => this.organizationMembersStore.setLoading(false))).subscribe(() => {
        this.alertService.simpleSuccess();
        this.updateCanEdit(organizationID);
        this.organizationMembersStore.setError(false);
      }, error => {
        this.alertService.detailedError(error);
        this.organizationMembersStore.setError(true);
      });
  }

  /**
   * Figures out whether the user can edit the organization info
   *
   * @param {Organisation} organization  The current organization being viewed
   * @returns {boolean}                  Whether the user belongs to this organization and can edit
   * @memberof OrganizationService
   */
  updateCanEdit(organizationID: number) {
    this.organizationMembersStore.setLoading(true);
    this.organizationMembersStore.setError(false);
    this.organisationsService.getOrganisationMembers(organizationID)
      .pipe(finalize(() => this.organizationMembersStore.setLoading(false))).subscribe((organizationUsers: OrganisationUser[]) => {
        // This gets the current user's ID at this specific point in time.
        // If you can somehow manage to change users without this function triggering again, then it may lead to issues.
        // Example: a user has permissions to edit, logs out without changing the page and running this function somehow, the controls
        // appears as if he still has permissions to edit.
        const currentUserId = this.userQuery.getSnapshot().user.id;
        const canEdit = organizationUsers.some(user => user.id.userId === currentUserId);
        this.setCanEditState(canEdit);
        this.updateAll(organizationUsers);
        this.organizationMembersStore.setError(false);
      }, (error: HttpErrorResponse) => {
        this.organizationMembersStore.setError(true);
        this.matSnackBar.open('Could not get organization members: ' + error.message);
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
