import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AlertService } from '../alert/state/alert.service';
import { BioWorkflow, UsersService, Workflow, WorkflowsService } from '../openapi';
import { Repository } from '../openapi/model/repository';
import { EntryWizardQuery } from './entry-wizard.query';
import { EntryWizardStore } from './entry-wizard.store';

@Injectable({
  providedIn: 'root'
})
export class EntryWizardService {
  constructor(
    private entryWizardStore: EntryWizardStore,
    private entryWizardQuery: EntryWizardQuery,
    private usersService: UsersService,
    private alertService: AlertService,
    private workflowsService: WorkflowsService
  ) {}

  /**
   * Updates the list of git registries
   */
  updateGitRegistryStore() {
    this.entryWizardStore.setLoading(true);
    this.usersService
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
    this.usersService
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

    this.usersService
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
  addWorkflowToDatabase(repository: Repository) {
    this.updateRepoIsPresent(repository, true, true);
    this.entryWizardStore.setLoading(true);
    const registryEnum = this.convertSourceControlStringToEnum(repository.gitRegistry);
    this.workflowsService
      .addWorkflow(registryEnum, repository.organization, repository.repositoryName)
      .pipe(finalize(() => this.entryWizardStore.setLoading(false)))
      .subscribe(
        (workflow: BioWorkflow) => {
          this.alertService.detailedSuccess('Workflow ' + repository.gitRegistry + '/' + repository.path + ' has been added');
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
          this.updateRepoIsPresent(repository, false, false);
        }
      );
  }

  /**
   * Removes a workflow for the given git repository
   * @param repository git repository
   */
  removeWorkflowFromDatabase(repository: Repository) {
    this.updateRepoIsPresent(repository, false, false);
    this.entryWizardStore.setLoading(true);
    const registryEnum = this.convertSourceControlStringToEnum(repository.gitRegistry);
    this.workflowsService
      .deleteWorkflow(registryEnum, repository.organization, repository.repositoryName)
      .pipe(finalize(() => this.entryWizardStore.setLoading(false)))
      .subscribe(
        (workflow: BioWorkflow) => {
          this.alertService.detailedSuccess('Workflow ' + repository.gitRegistry + '/' + repository.path + ' has been deleted');
          // move this to be called right away
          // on error, will revert state back
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
          this.updateRepoIsPresent(repository, true, true);
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
    const index = gitRepos.findIndex(repo => {
      return repository.path === repo.path && repository.gitRegistry === repo.gitRegistry;
    });

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
  convertSourceControlStringToEnum(sourceControl: string): Workflow.SourceControlEnum {
    switch (sourceControl) {
      case Workflow.SourceControlEnum.GithubCom: {
        return Workflow.SourceControlEnum.GithubCom;
      }
      case Workflow.SourceControlEnum.GitlabCom: {
        return Workflow.SourceControlEnum.GitlabCom;
      }
      case Workflow.SourceControlEnum.BitbucketOrg: {
        return Workflow.SourceControlEnum.BitbucketOrg;
      }
      case Workflow.SourceControlEnum.DockstoreOrg: {
        return Workflow.SourceControlEnum.DockstoreOrg;
      }
      default:
        console.error(sourceControl + ' is not a valid Source Control.');
        return null;
    }
  }
}
