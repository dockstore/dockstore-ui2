import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ID, transaction } from '@datorama/akita';
import { finalize } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { OrganizationsService, OrganizationUser } from '../../shared/swagger';
import { UserQuery } from '../../shared/user/user.query';
import { OrganizationMembersStore } from './organization-members.store';
import { OrganizationStore } from './organization.store';

@Injectable({ providedIn: 'root' })
export class OrganizationMembersService {
  constructor(
    private organizationMembersStore: OrganizationMembersStore,
    private organizationsService: OrganizationsService,
    private userQuery: UserQuery,
    private organizationStore: OrganizationStore,
    private alertService: AlertService,
    private matSnackBar: MatSnackBar
  ) {}

  /**
   * Update the Akita store with the latest array of organization users
   *
   * @param {OrganizationUser[]} organizationUsers  The latest array of organization users
   * @memberof OrganizationMembersService
   */
  @transaction()
  updateAll(organizationUsers: OrganizationUser[]) {
    // Can't use set because Akita isn't able to figure out the entity id
    this.organizationMembersStore.remove();
    organizationUsers.forEach((organizationUser) => {
      this.organizationMembersStore.upsert(organizationUser.id.userId, organizationUser);
    });
  }

  add(organizationMember: OrganizationUser) {
    this.organizationMembersStore.add(organizationMember);
  }

  update(id, organizationMember: Partial<OrganizationUser>) {
    this.organizationMembersStore.update(id, organizationMember);
  }

  remove(id: ID) {
    this.organizationMembersStore.remove(id);
  }

  /**
   * Remove a user from an organization in Dockstore
   * Uses the alertService but setting the state loading/error too just in case it's used in the future
   * @param {OrganizationUser} organizationUser  The organization user to remove from the organization
   * @memberof OrganizationMembersService
   */
  removeUser(organizationUser: OrganizationUser) {
    this.alertService.start('Removing user');
    const organizationID: number = organizationUser.organization.id;
    this.beforeCall();
    this.organizationsService
      .deleteUserRole(organizationUser.user.id, organizationID)
      .pipe(finalize(() => this.organizationMembersStore.setLoading(false)))
      .subscribe(
        () => {
          this.alertService.simpleSuccess();
          this.updateCanModify(organizationID);
          this.organizationMembersStore.setError(false);
        },
        (error) => {
          this.alertService.detailedError(error);
          this.organizationMembersStore.setError(true);
        }
      );
  }

  /**
   * Figures out whether the can modify the organization or the collections it owns
   *
   * @param {Organization} organization  The current organization being viewed
   * @returns {boolean}                  Whether the user belongs to this organization and can edit
   * @memberof OrganizationService
   */
  updateCanModify(organizationID: number) {
    this.beforeCall();
    this.organizationsService
      .getOrganizationMembers(organizationID)
      .pipe(finalize(() => this.organizationMembersStore.setLoading(false)))
      .subscribe(
        (organizationUsers: OrganizationUser[]) => {
          // This gets the current user's ID at this specific point in time.
          // If you can somehow manage to change users without this function triggering again, then it may lead to issues.
          // Example: a user has permissions to edit, logs out without changing the page and running this function somehow, the controls
          // appears as if he still has permissions to edit.
          if (this.userQuery.getValue().user) {
            const currentUserId = this.userQuery.getValue().user.id;
            const canEdit = organizationUsers.some(
              (user) =>
                user.id.userId === currentUserId &&
                user.accepted &&
                (user.role === OrganizationUser.RoleEnum.ADMIN || user.role === OrganizationUser.RoleEnum.MAINTAINER)
            );
            const canEditMembers = organizationUsers.some(
              (user) => user.id.userId === currentUserId && user.accepted && user.role === OrganizationUser.RoleEnum.ADMIN
            );
            const canDeleteCollection = organizationUsers.some(
              (user) => user.id.userId === currentUserId && user.accepted && user.role === OrganizationUser.RoleEnum.ADMIN
            );
            this.setCanModifyState(canEdit, canEditMembers, canDeleteCollection);
          } else {
            this.setCanModifyState(false, false, false);
          }
          this.updateAll(organizationUsers);
          this.organizationMembersStore.setError(false);
        },
        (error: HttpErrorResponse) => {
          this.organizationMembersStore.remove();
          this.organizationMembersStore.setError(true);
          this.matSnackBar.open('Could not get organization members: ' + error.message);
        }
      );
  }

  /**
   * Things to do before any sequence of HTTP calls
   *
   * @private
   * @memberof OrganizationMembersService
   */
  private beforeCall() {
    this.organizationMembersStore.setLoading(true);
    this.organizationMembersStore.setError(false);
  }

  setCanModifyState(canEdit: boolean, canEditMembers: boolean, canDeleteCollection) {
    this.organizationStore.update((state) => {
      return {
        ...state,
        canEdit: canEdit,
        canEditMembership: canEditMembers,
        canDeleteCollection: canEditMembers,
      };
    });
  }
}
