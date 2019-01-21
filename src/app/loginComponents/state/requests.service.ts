import { Injectable } from '@angular/core';
import { RequestsStore, RequestsState } from './requests.store';
import { AlertService } from '../../shared/alert/state/alert.service';
import { Organisation, OrganisationsService } from '../../shared/swagger';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RequestsService {

  constructor(private requestsStore: RequestsStore, private alertService: AlertService,
              private organisationsService: OrganisationsService) {
  }

  updateOrganizations(): void {
    this.alertService.start('Getting unapproved organizations');
    this.organisationsService.getAllOrganisations('unapproved').pipe(
      finalize(() => this.requestsStore.setLoading(false)
      ))
    .subscribe((organizations: Array<Organisation>) => {
      this.updateOrganizationState(organizations);
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
      })
  }

  updateOrganizationState(organizations: Array<Organisation>): void {
    this.requestsStore.setState((state: RequestsState) => {
      return {
        ...state,
        organizations: organizations
      };
    });
  }
}
