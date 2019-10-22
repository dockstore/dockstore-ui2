import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { EntryWizardStore, EntryWizardState } from './entry-wizard.store';

@Injectable({ providedIn: 'root' })
export class EntryWizardQuery extends QueryEntity<EntryWizardState> {
  selectGitRegistries$ = this.select(state => state.gitRegistries);
  selectGitOrganizations$ = this.select(state => state.gitOrganizations);
  selectGitRepositories$ = this.select(state => state.gitRepositories);

  constructor(protected store: EntryWizardStore) {
    super(store);
  }
}
