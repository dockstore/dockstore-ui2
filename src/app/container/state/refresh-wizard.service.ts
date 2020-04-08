import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { transaction } from '@datorama/akita';
import { MytoolsService } from 'app/mytools/mytools.service';
import { TokenSource } from 'app/shared/enum/token-source.enum';
import { UsersService } from 'app/shared/openapi';
import { SessionQuery } from 'app/shared/session/session.query';
import { SessionService } from 'app/shared/session/session.service';
import { UsersService as SwaggerUsersService } from 'app/shared/swagger';
import { UserQuery } from 'app/shared/user/user.query';
import { finalize } from 'rxjs/operators';
import { RefreshWizardQuery } from './refresh-wizard.query';
import { RefreshWizardStore } from './refresh-wizard.store';

@Injectable()
export class RefreshWizardService {
  constructor(
    private refreshWizardStore: RefreshWizardStore,
    private dockerRegistriesService: UsersService,
    private swaggerUsersService: SwaggerUsersService,
    private userQuery: UserQuery,
    private refreshWizardQuery: RefreshWizardQuery,
    private matSnackBar: MatSnackBar,
    private myToolsService: MytoolsService,
    private sessionQuery: SessionQuery,
    private sessionService: SessionService
  ) {}
  getOrganizations(dockerRegistry: string) {
    this.refreshWizardStore.setLoading(true);
    this.dockerRegistriesService
      .getDockerRegistriesOrganization(dockerRegistry)
      .pipe(finalize(() => this.refreshWizardStore.setLoading(false)))
      .subscribe(
        organizations => {
          this.setOrganizations(organizations);
        },
        error => {
          this.setError(error);
        }
      );
  }

  setError(error: HttpErrorResponse | null) {
    this.refreshWizardStore.update(state => {
      return {
        ...state,
        error: error
      };
    });
  }

  refreshRepository(repository: string) {
    this.sessionService.setLoadingDialog(true);
    const userId = this.userQuery.getValue().user.id;
    const entryType = this.sessionQuery.getValue().entryType;
    const selectedOrganization = this.refreshWizardQuery.getValue().selectedOrganization;
    this.swaggerUsersService
      .refreshToolsByOrganization(userId, selectedOrganization, repository)
      .pipe(finalize(() => this.sessionService.setLoadingDialog(false)))
      .subscribe(
        () => {
          this.matSnackBar.open('Refreshing tool succeeded');
          this.myToolsService.getMyEntries(userId, entryType);
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
      .getDockerRegistryOrganizationRepositories(TokenSource.QUAY, organization)
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

  setSelectedOrganization(organization: string) {
    this.refreshWizardStore.update(state => {
      return {
        ...state,
        selectedOrganization: organization
      };
    });
  }
}
