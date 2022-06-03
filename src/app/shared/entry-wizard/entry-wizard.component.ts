import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Repository } from '../openapi/model/repository';
import { EntryWizardQuery } from '../state/entry-wizard.query';
import { EntryWizardService } from '../state/entry-wizard.service';

@Component({
  selector: 'app-entry-wizard',
  templateUrl: './entry-wizard.component.html',
  styleUrls: ['./entry-wizard.component.scss'],
})
export class EntryWizardComponent implements OnInit {
  isLoading$: Observable<boolean>;
  gitRegistries$: Observable<string[]>;
  gitOrganizations$: Observable<string[]>;
  gitRepositories$: Observable<Repository[]>;
  selectedGitRegistry: string = undefined;
  selectedGitOrganization: string = undefined;

  constructor(private entryWizardQuery: EntryWizardQuery, private entryWizardService: EntryWizardService) {}

  ngOnInit() {
    this.entryWizardService.updateGitRegistryStore();
    this.isLoading$ = this.entryWizardQuery.selectLoading();
    this.gitRegistries$ = this.entryWizardQuery.selectGitRegistries$;
    this.gitOrganizations$ = this.entryWizardQuery.selectGitOrganizations$;
    this.gitRepositories$ = this.entryWizardQuery.selectGitRepositories$.pipe(
      map((repositories) => {
        if (repositories) {
          repositories.sort((a, b) => a.repositoryName.localeCompare(b.repositoryName));
          return repositories;
        } else {
          return null;
        }
      })
    );
  }

  /**
   * Given a registry will retrieve all associated organizations for the logged in user
   * @param selectedRegistry the selected registry
   */
  getOrganizations(selectedRegistry: string) {
    this.entryWizardService.updateGitOrganizationStore(selectedRegistry);
  }

  /**
   * Given an organization will retrieve all associated repositories for the logged in user
   * @param selectedOrganization the seleceted organization
   */
  getRepositories(selectedOrganization: string) {
    this.entryWizardService.updateGitRepositoryStore(this.selectedGitRegistry, selectedOrganization);
  }

  /**
   * Called on slide toggle to add or remove workflow
   * @param event toggle event
   */
  toggleRepo(event: MatSlideToggleChange, repo: Repository) {
    if (event.checked) {
      this.entryWizardService.addWorkflowToDatabase(repo);
    } else {
      this.entryWizardService.removeWorkflowFromDatabase(repo);
    }
  }
}
