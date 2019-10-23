import { Injectable } from '@angular/core';
import { EntryWizardStore } from './entry-wizard.store';
import { DefaultService, BioWorkflow } from '../openapi';
import { AlertService } from '../alert/state/alert.service';
import { Repository } from '../openapi/model/repository';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { EntryWizardQuery } from './entry-wizard.query';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Injectable({
  providedIn: 'root'
})
export class EntryWizardService {
  constructor(
    private entryWizardStore: EntryWizardStore,
    private entryWizardQuery: EntryWizardQuery,
    private defaultService: DefaultService,
    private alertService: AlertService
  ) {}

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
   * @param repository git repository
   */
  addWorkflowToDatabase(repository: Repository, matSlideToggle: MatSlideToggle) {
    this.entryWizardStore.setLoading(true);
    const registryEnum = this.convertSourceControlStringToEnum(repository.gitRegistry);
    this.defaultService
      .addWorkflow(registryEnum, repository.organization, repository.repositoryName)
      .pipe(finalize(() => this.entryWizardStore.setLoading(false)))
      .subscribe(
        (workflow: BioWorkflow) => {
          this.alertService.detailedSuccess('Workflow ' + repository.gitRegistry + '/' + repository.path + ' has been added');
          this.updateRepoIsPresent(repository, true, true);
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
          matSlideToggle.toggle();
        }
      );
  }

  /**
   * Removes a workflow for the given git repository
   * @param repository git repository
   */
  removeWorkflowFromDatabase(repository: Repository, matSlideToggle: MatSlideToggle) {
    this.entryWizardStore.setLoading(true);
    const registryEnum = this.convertSourceControlStringToEnum(repository.gitRegistry);
    this.defaultService
      .deleteWorkflow(registryEnum, repository.organization, repository.repositoryName)
      .pipe(finalize(() => this.entryWizardStore.setLoading(false)))
      .subscribe(
        (workflow: BioWorkflow) => {
          this.alertService.detailedSuccess('Workflow ' + repository.gitRegistry + '/' + repository.path + ' has been deleted');
          this.updateRepoIsPresent(repository, false, false);
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
          matSlideToggle.toggle();
        }
      );
  }

  /**
   * Updates the given repository in the store with the new isPresent value
   * @param repository repository to update
   * @param isPresent whether or not workflow now exists in database
   * @param canDelete whether or not workflow can now be deleted
   */
  updateRepoIsPresent(repository: Repository, isPresent: boolean, canDelete: boolean) {
    const state = this.entryWizardQuery.getValue();
    const gitRepos = state.gitRepositories;
    const index = gitRepos.indexOf(repository);

    const newRepository: Repository = {
      organization: repository.organization,
      repositoryName: repository.repositoryName,
      gitRegistry: repository.gitRegistry,
      canDelete: canDelete,
      present: isPresent,
      path: repository.path
    };

    const updatedGitRepos = Object.assign([], gitRepos);
    updatedGitRepos[index] = newRepository;
    this.entryWizardStore.update({ gitRepositories: updatedGitRepos });
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
