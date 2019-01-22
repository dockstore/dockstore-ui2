import { Injectable } from '@angular/core';
import { RequestsStore, RequestsState } from './requests.store';
import { AlertService } from '../../shared/alert/state/alert.service';
import { Organisation, OrganisationsService, UsersService } from '../../shared/swagger';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RequestsService {

  constructor(private requestsStore: RequestsStore, private alertService: AlertService,
              private organisationsService: OrganisationsService, private usersService: UsersService) {
  }

  updateOrganizations(): void {
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
        this.updateOrganizations();
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
        this.updateOrganizations();
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

  updateMyPendingOrganizations(): void {
    this.alertService.start('Getting my pending organizations');
    this.usersService.getUserOrganisations().pipe(
      finalize(() => this.requestsStore.setLoading(false)
      ))
    .subscribe((myPendingOrganizations: Array<Organisation>) => {
      this.updateMyOrganizationState(myPendingOrganizations);
      this.alertService.simpleSuccess();
    }, () => {
      this.updateMyOrganizationState(null);
      this.requestsStore.setError(true);
      this.alertService.simpleError();
    });
  }

  updateMyOrganizationState(myPendingOrganizations: Array<Organisation>): void {
    this.requestsStore.setState((state: RequestsState) => {
      return {
        ...state,
        myPendingOrganizations: myPendingOrganizations
      };
    });
  }
}
