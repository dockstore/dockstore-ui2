import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { EntryWizardStore, EntryWizardState } from './entry-wizard.store';

@Injectable({ providedIn: 'root' })
export class EntryWizardQuery extends QueryEntity<EntryWizardState> {
  selectGitRegistries$ = this.select('gitRegistries');
  selectGitOrganizations$ = this.select('gitOrganizations');
  selectGitRepositories$ = this.select('gitRepositories');
  selectGitRepositoriesNotInDatabase$ = this.select('gitRepositoriesNotInDatabase');

  constructor(protected store: EntryWizardStore) {
    super(store);
  }
}
