import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { transaction } from '@datorama/akita';
import { TokenSource } from 'app/shared/enum/token-source.enum';
import { UsersService } from 'app/shared/openapi';
import { UsersService as SwaggerUsersService } from 'app/shared/swagger';
import { UserQuery } from 'app/shared/user/user.query';
import { finalize } from 'rxjs/operators';
import { RefreshWizardQuery } from './refresh-wizard.query';
import { RefreshWizardStore } from './refresh-wizard.store';

@Injectable({ providedIn: 'root' })
export class RefreshWizardService {
  constructor(
    private refreshWizardStore: RefreshWizardStore,
    private dockerRegistriesService: UsersService,
    private swaggerUsersService: SwaggerUsersService,
    private userQuery: UserQuery,
    private refreshWizardQuery: RefreshWizardQuery,
    private matSnackBar: MatSnackBar
  ) {}
  getOrganizations(dockerRegistry: string) {
    this.refreshWizardStore.setLoading(true);
    this.dockerRegistriesService
      .getDockerRegistriesOrganization(dockerRegistry)
      .pipe(finalize(() => this.refreshWizardStore.setLoading(false)))
      .subscribe(organizations => {
        console.log(organizations);
        this.setOrganizations(organizations);
      });
  }

  refreshOrganization(organization: string) {
    this.refreshWizardStore.setLoading(true);
    this.swaggerUsersService
      .refreshToolsByOrganization(this.userQuery.getValue().user.id, organization, TokenSource.QUAY)
      .pipe(finalize(() => this.refreshWizardStore.setLoading(false)))
      .subscribe(thing => {
        console.log('I have no idea what this returns');
      });
  }

  refreshRepository(repository: string) {
    this.setRepositoryLoading(true);
    const selectedOrganization = this.refreshWizardQuery.getValue().selectedOrganization;
    this.swaggerUsersService
      .refreshToolsByOrganization(this.userQuery.getValue().user.id, selectedOrganization, repository)
      .pipe(finalize(() => this.setRepositoryLoading(false)))
      .subscribe(
        () => {
          this.matSnackBar.open('Refreshing tool succeeded');
        },
        error => {
          this.matSnackBar.open('Refreshing tool failed');
        }
      );
  }

  @transaction()
  getRepositories(organization: string) {
    this.refreshWizardStore.setLoading(true);
    this.dockerRegistriesService
      .getDockerRegistriesOrganization1(TokenSource.QUAY, organization)
      .pipe(finalize(() => this.refreshWizardStore.setLoading(false)))
      .subscribe(repositories => {
        this.setSelectedOrganization(organization);
        this.setRepositories(repositories);
      });
  }

  setRepositories(repositories: string[]): void {
    this.refreshWizardStore.update(state => {
      return {
        ...state,
        repositories: repositories
      };
    });
  }

  setOrganizations(organizations: string[]): void {
    this.refreshWizardStore.update(state => {
      return {
        ...state,
        organizations: organizations
      };
    });
  }

  setRepositoryLoading(loading: boolean) {
    this.refreshWizardStore.update(state => {
      return {
        ...state,
        repositoryLoading: loading
      };
    });
  }

  setSelectedOrganization(organization: string) {
    this.refreshWizardStore.update(state => {
      return {
        ...state,
        selectedOrganization: organization
      };
    });
  }
}
