import { Component, OnInit } from '@angular/core';
import { EntryWizardService } from '../state/entry-wizard.service';
import { EntryWizardQuery } from '../state/entry-wizard.query';
import { EntryWizard } from '../state/entry-wizard.model';
import { ID } from '@datorama/akita';
import { Observable } from 'rxjs';

@Component({
  selector: 'entry-wizard',
  templateUrl: './entry-wizard.component.html',
  styleUrls: ['./entry-wizard.component.scss']
})
export class EntryWizardComponent implements OnInit {
  isLoading$: Observable<boolean>;
  gitRegistries$: Observable<string[]>;
  gitOrganizations$: Observable<string[]>;
  gitRepositories$: Observable<string[]>;
  selectedGitRegistry: string = null;
  selectedGitOrganization: string = null;

  constructor(private entryWizardQuery: EntryWizardQuery, private entryWizardService: EntryWizardService) {}

  ngOnInit() {
    this.entryWizardService.updateGitRegistries();
    this.isLoading$ = this.entryWizardQuery.selectLoading();
    this.gitRegistries$ = this.entryWizardQuery.selectGitRegistries$;
    this.gitOrganizations$ = this.entryWizardQuery.selectGitOrganizations$;
    this.gitRepositories$ = this.entryWizardQuery.selectGitRepositories$;
  }

  getOrganizations(selectedRegistry) {
    this.entryWizardService.updateGitOrganizations(selectedRegistry);
  }

  getRepositories(selectedOrganization) {
    this.entryWizardService.updateGitRepositories(this.selectedGitRegistry, selectedOrganization);
  }

  toggleRepo(event) {
    if (event.checked) {
      this.entryWizardService.addWorkflow(this.selectedGitRegistry, event.source.name);
    } else if (!event.checked) {
      this.entryWizardService.removeWorkflow(this.selectedGitRegistry, event.source.name);
    }
  }
}
