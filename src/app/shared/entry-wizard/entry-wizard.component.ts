import { Component, OnInit } from '@angular/core';
import { EntryWizardService } from '../state/entry-wizard.service';
import { EntryWizardQuery } from '../state/entry-wizard.query';
import { Observable } from 'rxjs';
import { Repository } from '../openapi/model/repository';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'entry-wizard',
  templateUrl: './entry-wizard.component.html',
  styleUrls: ['./entry-wizard.component.scss']
})
export class EntryWizardComponent implements OnInit {
  isLoading$: Observable<boolean>;
  gitRegistries$: Observable<string[]>;
  gitOrganizations$: Observable<string[]>;
  gitRepositories$: Observable<Repository[]>;
  selectedGitRegistry: string = null;
  selectedGitOrganization: string = null;

  constructor(private entryWizardQuery: EntryWizardQuery, private entryWizardService: EntryWizardService) {}

  ngOnInit() {
    this.entryWizardService.updateGitRegistryStore();
    this.isLoading$ = this.entryWizardQuery.selectLoading();
    this.gitRegistries$ = this.entryWizardQuery.selectGitRegistries$;
    this.gitOrganizations$ = this.entryWizardQuery.selectGitOrganizations$;
    this.gitRepositories$ = this.entryWizardQuery.selectGitRepositories$;
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
      this.entryWizardService.addWorkflowToDatabase(repo, event.source);
    } else {
      this.entryWizardService.removeWorkflowFromDatabase(repo, event.source);
    }
  }
}
