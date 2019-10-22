import { Injectable } from '@angular/core';
import { EntryWizardStore } from './entry-wizard.store';
import { DefaultService, BioWorkflow } from '../openapi';
import { AlertService } from '../alert/state/alert.service';
import { Repository } from '../openapi/model/repository';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EntryWizardService {
  constructor(private entryWizardStore: EntryWizardStore, private defaultService: DefaultService, private alertService: AlertService) {}

  /**
   * Updates the list of git registries
   */
  updateGitRegistryStore() {
    this.entryWizardStore.setLoading(true);
    this.defaultService
      .getUserRegistries()
      .pipe(finalize(() => this.entryWizardStore.setLoading(false)))
      .subscribe(
        (registries: Array<string>) => {
          this.entryWizardStore.update({ gitRegistries: registries });
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
  }

  /**
   * Updates the list of organizations based on the given git registry
   * @param registry git registry
   */
  updateGitOrganizationStore(registry: string) {
    this.entryWizardStore.setLoading(true);
    this.entryWizardStore.update({ gitOrganizations: undefined, gitRepositories: undefined });
    const registryEnum = this.convertSourceControlStringToEnum(registry);
    this.defaultService
      .getUserOrganizations(registryEnum)
      .pipe(finalize(() => this.entryWizardStore.setLoading(false)))
      .subscribe(
        (organizations: Array<string>) => {
          this.entryWizardStore.update({ gitOrganizations: organizations });
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
  }

  /**
   * Updates the list of repositories based on the given git registry and organization
   * @param registry git registry
   * @param organization git organization
   */
  updateGitRepositoryStore(registry: string, organization: string) {
    this.entryWizardStore.setLoading(true);
    const registryEnum = this.convertSourceControlStringToEnum(registry);

    this.defaultService
      .getUserOrganizationRepositories(registryEnum, organization)
      .pipe(finalize(() => this.entryWizardStore.setLoading(false)))
      .subscribe(
        (repositories: Array<Repository>) => {
          this.entryWizardStore.update({ gitRepositories: repositories });
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
  }

  /**
   * Adds a workflow for the given git repository
   * @param registry git registry
   * @param organization git organization
   * @param repositoryName git repository name
   */
  addWorkflowToDatabase(registry: string, organization: string, repositoryName: string) {
    this.entryWizardStore.setLoading(true);
    const registryEnum = this.convertSourceControlStringToEnum(registry);
    this.defaultService
      .addWorkflow(registryEnum, organization, repositoryName)
      .pipe(finalize(() => this.entryWizardStore.setLoading(false)))
      .subscribe(
        (workflow: BioWorkflow) => {
          this.alertService.detailedSuccess('Workflow ' + registry + '/' + organization + '/' + repositoryName + ' has been added');
          this.updateGitRepositoryStore(registry, organization);
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
          this.updateGitRepositoryStore(registry, organization);
        }
      );
  }

  /**
   * Removes a workflow for the given git repository
   * @param registry git registry
   * @param organization git organization
   * @param repositoryName git repository name
   */
  removeWorkflowToDatabase(registry: string, organization: string, repositoryName: string) {
    this.entryWizardStore.setLoading(true);
    const registryEnum = this.convertSourceControlStringToEnum(registry);
    this.defaultService
      .deleteWorkflow(registryEnum, organization, repositoryName)
      .pipe(finalize(() => this.entryWizardStore.setLoading(false)))
      .subscribe(
        (workflow: BioWorkflow) => {
          this.alertService.detailedSuccess('Workflow ' + registry + '/' + organization + '/' + repositoryName + ' has been deleted');
          this.updateGitRepositoryStore(registry, organization);
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
          this.updateGitRepositoryStore(registry, organization);
        }
      );
  }

  /**
   * Converts a string source control to a Source Control enum
   * @param sourceControl source control string
   */
  convertSourceControlStringToEnum(sourceControl: string): BioWorkflow.SourceControlEnum {
    switch (sourceControl) {
      case BioWorkflow.SourceControlEnum.GithubCom: {
        return BioWorkflow.SourceControlEnum.GithubCom;
      }
      case BioWorkflow.SourceControlEnum.GitlabCom: {
        return BioWorkflow.SourceControlEnum.GitlabCom;
      }
      case BioWorkflow.SourceControlEnum.BitbucketOrg: {
        return BioWorkflow.SourceControlEnum.BitbucketOrg;
      }
      case BioWorkflow.SourceControlEnum.DockstoreOrg: {
        return BioWorkflow.SourceControlEnum.DockstoreOrg;
      }
    }
    return null;
  }
}
