import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { Organization, OrganizationsService, OrganizationUser, User, UsersService } from '../../shared/swagger';
import { RequestsState, RequestsStore } from './requests.store';

@Injectable({ providedIn: 'root' })
export class RequestsService {
  constructor(
    private requestsStore: RequestsStore,
    private alertService: AlertService,
    private organizationsService: OrganizationsService,
    private usersService: UsersService
  ) {}

  /**
   * Updates the list of organizations that the curator can approve or reject
   */
  updateCuratorOrganizations(): void {
    this.alertService.start('Getting pending organizations');
    this.organizationsService
      .getAllOrganizations('pending')
      .pipe(finalize(() => this.requestsStore.setLoading(false)))
      .subscribe(
        (allPendingOrganizations: Array<Organization>) => {
          this.updateOrganizationState(allPendingOrganizations);
          this.alertService.simpleSuccess();
        },
        () => {
          this.updateOrganizationState(null);
          this.requestsStore.setError(true);
          this.alertService.simpleError();
        }
      );
  }

  /**
   * Approves an organization and updates the list of organizations
   * @param id Organization id
   */
  approveOrganization(id: number): void {
    this.alertService.start('Approving organization ' + id);
    this.organizationsService
      .approveOrganization(id, null, null)
      .pipe(finalize(() => this.requestsStore.setLoading(false)))
      .subscribe(
        (organization: Organization) => {
          this.alertService.simpleSuccess();
          this.updateCuratorOrganizations();
          this.updateMyMemberships();
        },
        () => {
          this.updateOrganizationState(null);
          this.requestsStore.setError(true);
          this.alertService.simpleError();
        }
      );
  }

  /**
   * Rejects an organization and updates the list of organizations
   * @param id Organization id
   */
  rejectOrganization(id: number): void {
    this.alertService.start('Rejected organization ' + id);
    this.organizationsService
      .rejectOrganization(id, null, null)
      .pipe(finalize(() => this.requestsStore.setLoading(false)))
      .subscribe(
        (organization: Organization) => {
          this.alertService.simpleSuccess();
          this.updateCuratorOrganizations();
          this.updateMyMemberships();
        },
        () => {
          this.updateOrganizationState(null);
          this.requestsStore.setError(true);
          this.alertService.simpleError();
        }
      );
  }

  /**
   * Updates the list of pending organizations
   * @param allPendingOrganizations Newly updated list of pending organizations
   */
  updateOrganizationState(allPendingOrganizations: Array<Organization>): void {
    this.requestsStore.update((state: RequestsState) => {
      return {
        ...state,
        allPendingOrganizations: allPendingOrganizations
      };
    });
  }

  /**
   * Updates the list of memberships (OrganizationUser) for the logged in user
   */
  updateMyMemberships(): void {
    this.alertService.start('Getting my memberships');
    this.usersService
      .getUserMemberships()
      .pipe(finalize(() => this.requestsStore.setLoading(false)))
      .subscribe(
        (myMemberships: Array<OrganizationUser>) => {
          const myOrganizationInvites = myMemberships.filter(membership => !membership.accepted);
          const myPendingOrganizationRequests = myMemberships.filter(
            membership => membership.organization.status === 'PENDING' && membership.accepted
          );
          const myRejectedOrganizationRequests = myMemberships.filter(
            membership => membership.organization.status === 'REJECTED' && membership.accepted
          );

          this.updateMyMembershipState(myMemberships, myOrganizationInvites, myPendingOrganizationRequests, myRejectedOrganizationRequests);
          this.alertService.simpleSuccess();
        },
        () => {
          this.updateMyMembershipState(null, null, null, null);
          this.requestsStore.setError(true);
          this.alertService.simpleError();
        }
      );
  }

  /**
   * Updates the store information for various lists of membership for the logged in user
   * @param myMemberships
   * @param myOrganizationInvites
   * @param myPendingOrganizationRequests
   */
  updateMyMembershipState(
    myMemberships: Array<OrganizationUser>,
    myOrganizationInvites: Array<OrganizationUser>,
    myPendingOrganizationRequests: Array<OrganizationUser>,
    myRejectedOrganizationRequests: Array<OrganizationUser>
  ): void {
    this.requestsStore.update((state: RequestsState) => {
      return {
        ...state,
        myMemberships: myMemberships,
        myOrganizationInvites: myOrganizationInvites,
        myPendingOrganizationRequests: myPendingOrganizationRequests,
        myRejectedOrganizationRequests: myRejectedOrganizationRequests
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
    this.organizationsService
      .acceptOrRejectInvitation(id, accept)
      .pipe(finalize(() => this.requestsStore.setLoading(false)))
      .subscribe(
        (user: User) => {
          this.alertService.simpleSuccess();
          this.updateMyMemberships();
        },
        () => {
          this.updateMyMembershipState(null, null, null, null);
          this.requestsStore.setError(true);
          this.alertService.simpleError();
        }
      );
  }

  requestRereview(id: number): void {
    this.alertService.start('Rerequesting review for organization ' + id);
    this.organizationsService
      .requestOrganizationReview(id)
      .pipe(finalize(() => this.requestsStore.setLoading(false)))
      .subscribe(
        (organization: Organization) => {
          this.alertService.simpleSuccess();
          this.updateCuratorOrganizations();
          this.updateMyMemberships();
        },
        () => {
          this.updateMyMembershipState(null, null, null, null);
          this.requestsStore.setError(true);
          this.alertService.simpleError();
        }
      );
  }
}
