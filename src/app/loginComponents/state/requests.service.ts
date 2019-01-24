import { Injectable } from '@angular/core';
import { RequestsStore, RequestsState } from './requests.store';
import { AlertService } from '../../shared/alert/state/alert.service';
import { Organisation, OrganisationsService, UsersService, OrganisationUser, User } from '../../shared/swagger';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RequestsService {

  constructor(private requestsStore: RequestsStore, private alertService: AlertService,
              private organisationsService: OrganisationsService, private usersService: UsersService) {
  }

  /**
   * Updates the list of organizations that the curator can approve or reject
   */
  updateCuratorOrganizations(): void {
    this.alertService.start('Getting pending organizations');
    this.organisationsService.getAllOrganisations('pending').pipe(
      finalize(() => this.requestsStore.setLoading(false)
      ))
    .subscribe((allPendingOrganizations: Array<Organisation>) => {
      this.updateOrganizationState(allPendingOrganizations);
      this.alertService.simpleSuccess();
    }, () => {
      this.updateOrganizationState(null);
      this.requestsStore.setError(true);
      this.alertService.simpleError();
    });
  }

  /**
   * Approves an organization and updates the list of organizations
   * @param id Organization id
   */
  approveOrganization(id: number): void {
    this.alertService.start('Approving organization ' + id);
    this.organisationsService.approveOrganisation(id, null, null).pipe(
      finalize(() => this.requestsStore.setLoading(false)
      ))
      .subscribe((organization: Organisation) => {
        this.alertService.simpleSuccess();
        this.updateCuratorOrganizations();
      }, () => {
        this.updateOrganizationState(null);
        this.requestsStore.setError(true);
        this.alertService.simpleError();
      });
  }

  /**
   * Rejects an organization and updates the list of organizations
   * @param id Organization id
   */
  rejectOrganization(id: number): void {
    this.alertService.start('Rejected organization ' + id);
    this.organisationsService.rejectOrganisation(id, null, null).pipe(
      finalize(() => this.requestsStore.setLoading(false)
      ))
      .subscribe((organization: Organisation) => {
        this.alertService.simpleSuccess();
        this.updateCuratorOrganizations();
      }, () => {
        this.updateOrganizationState(null);
        this.requestsStore.setError(true);
        this.alertService.simpleError();
      });
  }

  /**
   * Updates the list of pending organizations
   * @param allPendingOrganizations Newly updated list of pending organizations
   */
  updateOrganizationState(allPendingOrganizations: Array<Organisation>): void {
    this.requestsStore.setState((state: RequestsState) => {
      return {
        ...state,
        allPendingOrganizations: allPendingOrganizations
      };
    });
  }

  /**
   * Updates the list of memberships (OrganisationUser) for the logged in user
   */
  updateMyMemberships(): void {
    this.alertService.start('Getting my memberships');
    this.usersService.getUserMemberships().pipe(
      finalize(() => this.requestsStore.setLoading(false)
      ))
    .subscribe((myMemberships: Array<OrganisationUser>) => {
      const myOrganizationInvites = myMemberships.filter(membership => !membership.accepted);
      const myPendingOrganizationRequests = myMemberships.filter(membership => membership.organisation.status === 'PENDING'
      && membership.accepted);
      this.updateMyMembershipState(myMemberships, myOrganizationInvites, myPendingOrganizationRequests);
      this.alertService.simpleSuccess();
    }, () => {
      this.updateMyMembershipState(null, null, null);
      this.requestsStore.setError(true);
      this.alertService.simpleError();
    });
  }

  /**
   * Updates the store information for various lists of membership for the logged in user
   * @param myMemberships
   * @param myOrganizationInvites
   * @param myPendingOrganizationRequests
   */
  updateMyMembershipState(myMemberships: Array<OrganisationUser>, myOrganizationInvites: Array<OrganisationUser>,
    myPendingOrganizationRequests: Array<OrganisationUser>): void {
    this.requestsStore.setState((state: RequestsState) => {
      return {
        ...state,
        myMemberships: myMemberships,
        myOrganizationInvites: myOrganizationInvites,
        myPendingOrganizationRequests: myPendingOrganizationRequests
      };
    });
  }

  /**
   * Accept/reject an invitation to join an organization, and update my memberships accordingly
   * @param id Organization id
   * @param accept True to accept invite, false to reject
   */
  acceptOrRejectOrganizationInvite(id: number, accept: boolean): void {
    this.alertService.start('Approving organization ' + id);
    this.organisationsService.acceptOrRejectInvitation(id, accept).pipe(
      finalize(() => this.requestsStore.setLoading(false)
      ))
      .subscribe((user: User) => {
        this.alertService.simpleSuccess();
        this.updateMyMemberships();
      }, () => {
        this.updateMyMembershipState(null, null, null);
        this.requestsStore.setError(true);
        this.alertService.simpleError();
      });
  }
}
