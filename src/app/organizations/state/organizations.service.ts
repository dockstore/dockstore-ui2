import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrganizationsStore, OrganizationsState } from './organizations.store';
import { OrganisationsService, Organisation } from '../../shared/swagger';
import { AlertService } from '../../shared/alert/state/alert.service';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OrganizationsService {

  constructor(private organizationsStore: OrganizationsStore, private alertService: AlertService,
    private organisationsService: OrganisationsService) {
  }

  updateOrganizations() {
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

  updateOrganizationSearchName(searchName: string) {
    this.organizationsStore.setState((state: OrganizationsState) => {
      return {
        ...state,
        searchName: searchName
      };
    });
  }

  updateOrganizationState(organizations: Array<Organisation>) {
    this.organizationsStore.setState(state => {
      return {
        ...state,
        organizations: organizations
      };
    });
  }
}
