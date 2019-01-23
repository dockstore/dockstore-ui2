import { Injectable } from '@angular/core';
import { RequestsStore, RequestsState } from './requests.store';
import { AlertService } from '../../shared/alert/state/alert.service';
import { Organisation, OrganisationsService, UsersService, OrganisationUser } from '../../shared/swagger';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RequestsService {

  constructor(private requestsStore: RequestsStore, private alertService: AlertService,
              private organisationsService: OrganisationsService, private usersService: UsersService) {
  }

  // Curator Organizations
  updateCuratorOrganizations(): void {
    this.alertService.start('Getting pending organizations');
    this.organisationsService.getAllOrganisations('pending').pipe(
      finalize(() => this.requestsStore.setLoading(false)
      ))
    .subscribe((pendingOrganizationsAdminAndCurator: Array<Organisation>) => {
      this.updateOrganizationState(pendingOrganizationsAdminAndCurator);
      this.alertService.simpleSuccess();
    }, () => {
      this.updateOrganizationState(null);
      this.requestsStore.setError(true);
      this.alertService.simpleError();
    });
  }

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

  updateOrganizationState(pendingOrganizationsAdminAndCurator: Array<Organisation>): void {
    this.requestsStore.setState((state: RequestsState) => {
      return {
        ...state,
        pendingOrganizationsAdminAndCurator: pendingOrganizationsAdminAndCurator
      };
    });
  }

  // My Memberships
  updateMyMemberships(): void {
    this.alertService.start('Getting my memberships');
    this.usersService.getUserMemberships().pipe(
      finalize(() => this.requestsStore.setLoading(false)
      ))
    .subscribe((myMemberships: Array<OrganisationUser>) => {
      const myOrganizationInvites = myMemberships.filter(membership => membership.accepted);
      const myPendingOrganizationRequests = myMemberships.filter(membership => membership.organisation.status === 'PENDING');
      this.updateMyMembershipState(myMemberships, myOrganizationInvites, myPendingOrganizationRequests);
      this.alertService.simpleSuccess();
    }, () => {
      this.updateMyMembershipState(null, null, null);
      this.requestsStore.setError(true);
      this.alertService.simpleError();
    });
  }

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
}
