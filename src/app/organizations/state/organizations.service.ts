import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/state/alert.service';
import { Organisation, OrganisationsService } from '../../shared/swagger';
import { OrganizationsState, OrganizationsStore } from './organizations.store';

@Injectable({ providedIn: 'root' })
export class OrganizationsService {

  constructor(private organizationsStore: OrganizationsStore, private alertService: AlertService,
    private organisationsService: OrganisationsService) {
  }

  /**
   * Update the store with the current array of approved organizations
   *
   * @memberof OrganizationsService
   */
  updateOrganizations(): void {
    this.alertService.start('Getting approved organizations');
    this.organisationsService.getApprovedOrganisations().pipe(
      finalize(() => this.organizationsStore.setLoading(false)
      ))
      .subscribe((organizations: Array<Organisation>) => {
        this.updateOrganizationState(organizations);
        this.alertService.simpleSuccess();
      }, () => {
        this.updateOrganizationState(null);
        this.organizationsStore.setError(true);
        this.alertService.simpleError();
      });
  }

  updateSearchNameState(searchName: string): void {
    this.organizationsStore.setState((state: OrganizationsState) => {
      return {
        ...state,
        searchName: searchName
      };
    });
  }

  updateOrganizationState(organizations: Array<Organisation>): void {
    this.organizationsStore.setState((state: OrganizationsState) => {
      return {
        ...state,
        organizations: organizations
      };
    });
  }
}
