import { Injectable } from '@angular/core';
import { EntryWizardStore } from './entry-wizard.store';
import { DefaultService, BioWorkflow } from '../openapi';
import { AlertService } from '../alert/state/alert.service';
import { Repository } from '../openapi/model/repository';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EntryWizardService {
  constructor(private entryWizardStore: EntryWizardStore, private defaultService: DefaultService, private alertService: AlertService) {}

  /**
   * Updates the list of git registries
   */
  updateGitRegistries() {
    this.entryWizardStore.setLoading(true);
    this.defaultService.getUserRegistries().subscribe(
      (registries: Array<string>) => {
        this.entryWizardStore.update({ gitRegistries: registries });
        this.entryWizardStore.setLoading(false);
      },
      (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
        this.entryWizardStore.setLoading(false);
      }
    );
  }

  /**
   * Updates the list of organizations based on the given git registry
   * @param registry git registry
   */
  updateGitOrganizations(registry: string) {
    this.entryWizardStore.setLoading(true);
    this.entryWizardStore.update({ gitOrganizations: undefined, gitRepositories: undefined });
    const registryEnum = this.convertSourceControlStringToEnum(registry);
    this.defaultService.getUserOrganizations(registryEnum).subscribe(
      (organizations: Array<string>) => {
        this.entryWizardStore.update({ gitOrganizations: organizations });
        this.entryWizardStore.setLoading(false);
      },
      (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
        this.entryWizardStore.setLoading(false);
      }
    );
  }

  /**
   * Updates the list of repositories based on the given git registry and organization
   * @param registry git registry
   * @param organization git organization
   */
  updateGitRepositories(registry: string, organization: string) {
    this.entryWizardStore.setLoading(true);
    const registryEnum = this.convertSourceControlStringToEnum(registry);

    this.defaultService.getUserOrganizationRepositories(registryEnum, organization).subscribe(
      (repositories: Array<Repository>) => {
        this.entryWizardStore.update({ gitRepositories: repositories });
        this.entryWizardStore.setLoading(false);
      },
      (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
        this.entryWizardStore.setLoading(false);
      }
    );
  }

  /**
   * Adds a workflow for the given git repository
   * @param registry git registry
   * @param path git path (ex. dockstore/dockstore-ui2)
   */
  addWorkflow(registry: string, path: string) {
    this.entryWizardStore.setLoading(true);
    const splitPath = path.split('/');
    const org = splitPath[0];
    const repo = splitPath[1];
    const registryEnum = this.convertSourceControlStringToEnum(registry);
    this.defaultService.addWorkflow(registryEnum, org, repo).subscribe(
      (workflow: BioWorkflow) => {
        this.alertService.detailedSuccess('Workflow ' + registry + '/' + path + ' has been added');
        this.entryWizardStore.setLoading(false);
      },
      (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
        this.entryWizardStore.setLoading(false);
      }
    );
  }

  /**
   * Removes a workflow for the given git repository
   * @param registry git registry
   * @param path git path (ex. dockstore/dockstore-ui2)
   */
  removeWorkflow(registry: string, path: string) {
    this.entryWizardStore.setLoading(true);
    const splitPath = path.split('/');
    const org = splitPath[0];
    const repo = splitPath[1];
    const registryEnum = this.convertSourceControlStringToEnum(registry);
    this.defaultService.deleteWorkflow(registryEnum, org, repo).subscribe(
      (workflow: BioWorkflow) => {
        this.alertService.detailedSuccess('Workflow ' + registry + '/' + path + ' has been deleted');
        this.entryWizardStore.setLoading(false);
      },
      (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
        this.entryWizardStore.setLoading(false);
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
