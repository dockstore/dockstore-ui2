import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { Organization, OrganizationsService } from '../../shared/swagger';
import { OrganizationsState, OrganizationsStore } from './organizations.store';

@Injectable({ providedIn: 'root' })
export class OrganizationsStateService {
  constructor(
    private organizationsStore: OrganizationsStore,
    private alertService: AlertService,
    private organizationsService: OrganizationsService
  ) {}

  /**
   * Update the store with the current array of approved organizations
   *
   * @memberof OrganizationsStateService
   */
  updateOrganizations(): void {
    this.alertService.start('Getting approved organizations');
    this.organizationsService
      .getApprovedOrganizations()
      .pipe(finalize(() => this.organizationsStore.setLoading(false)))
      .subscribe(
        (organizations: Array<Organization>) => {
          this.updateOrganizationState(organizations);
          this.alertService.simpleSuccess();
        },
        () => {
          this.updateOrganizationState(null);
          this.organizationsStore.setError(true);
          this.alertService.simpleError();
        }
      );
  }

  updateSearchNameState(searchName: string): void {
    this.organizationsStore.update((state: OrganizationsState) => {
      return {
        ...state,
        searchName: searchName,
      };
    });
  }

  updateOrganizationState(organizations: Array<Organization>): void {
    this.organizationsStore.update((state: OrganizationsState) => {
      return {
        ...state,
        organizations: organizations,
      };
    });
  }

  updateSort(sortBy: 'starred' | 'name'): void {
    this.organizationsStore.update((state: OrganizationsState) => {
      return {
        ...state,
        sortBy: sortBy,
      };
    });
  }
}
