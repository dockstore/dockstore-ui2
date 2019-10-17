import { Injectable } from '@angular/core';
import { EntryWizardStore } from './entry-wizard.store';
import { DefaultService, BioWorkflow } from '../openapi';

@Injectable({
  providedIn: 'root'
})
export class EntryWizardService {
  constructor(private entryWizardStore: EntryWizardStore, private defaultService: DefaultService) {}

  updateGitRegistries() {
    this.defaultService.getUserRegistries().subscribe(
      (registries: Array<string>) => {
        this.entryWizardStore.update({ gitRegistries: registries });
        this.entryWizardStore.setLoading(false);
      },
      () => {}
    );
  }

  updateGitOrganizations(registry: string) {
    this.entryWizardStore.update({ gitOrganizations: [], gitRepositories: [] });
    const registryEnum = this.convertSourceControlStringToEnum(registry);
    this.defaultService.getUserOrganizations(registryEnum).subscribe(
      (organizations: Array<string>) => {
        this.entryWizardStore.update({ gitOrganizations: organizations });
        this.entryWizardStore.setLoading(false);
      },
      () => {}
    );
  }

  updateGitRepositories(registry: string, organization: string) {
    const registryEnum = this.convertSourceControlStringToEnum(registry);
    this.defaultService.getUserOrganizationRepositories(registryEnum, organization).subscribe(
      (repositories: Array<string>) => {
        this.entryWizardStore.update({ gitRepositories: repositories });
        this.entryWizardStore.setLoading(false);
      },
      () => {}
    );
  }

  addWorkflow(registry: string, path: string) {
    const splitPath = path.split('/');
    const org = splitPath[0];
    const repo = splitPath[1];
    const registryEnum = this.convertSourceControlStringToEnum(registry);
    this.defaultService.addWorkflow(registryEnum, org, repo).subscribe(
      (workflow: BioWorkflow) => {
        console.log(workflow);
      },
      () => {
        console.log('There was an error adding the workflow');
      }
    );
  }

  convertSourceControlStringToEnum(sourceControl: string): BioWorkflow.SourceControlEnum {
    console.log(BioWorkflow.SourceControlEnum.GithubCom);
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
