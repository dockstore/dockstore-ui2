import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/state/alert.service';
import { Organisation, OrganisationsService, OrganisationUser } from '../../shared/swagger';
import { UserQuery } from '../../shared/user/user.query';
import { OrganizationMembersStore } from './organization-members.store';
import { OrganizationQuery } from './organization.query';
import { OrganizationStore } from './organization.store';

@Injectable({ providedIn: 'root' })
export class OrganizationMembersService {

  constructor(private organizationMembersStore: OrganizationMembersStore, private organizationQuery: OrganizationQuery,
    private http: HttpClient, private organisationsService: OrganisationsService,
    private userQuery: UserQuery, private organizationStore: OrganizationStore, private alertService: AlertService) {
  }

  updateAll(organizationUsers: OrganisationUser[]) {
    this.organizationMembersStore.remove();
    this.organizationMembersStore.add(organizationUsers);
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

  removeUser(organizationUser: OrganisationUser) {
    this.alertService.start('Removing user');
    const organizationID: number = this.organizationQuery.getSnapshot().organization.id;
    this.organizationMembersStore.setLoading(true);
    this.organisationsService.deleteUserRole(organizationUser.user.id, organizationID)
      .pipe(finalize(() => this.organizationMembersStore.setLoading(false))).subscribe(() => {
        this.alertService.simpleSuccess();
      }, error => {
        this.alertService.detailedError(error);
      });
  }

  editUser(organizationUser: OrganisationUser) {

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
    this.organisationsService.getOrganisationMembers(organizationID)
      .pipe(finalize(() => this.organizationMembersStore.setLoading(false))).subscribe((organizationUsers: OrganisationUser[]) => {
        const currentUserId = this.userQuery.getSnapshot().user.id;
        const canEdit = organizationUsers.some(user => user.id.userId === currentUserId);
        this.setCanEditState(canEdit);
        this.updateAll(organizationUsers);
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
